import puppeteer from 'puppeteer-core';
import { PDFDocument } from 'pdf-lib';
import pdf from 'html-pdf';
import check_token from "./functions.js";
import { addMultiplePDFGeneratedData, getAllParameters, insertPDFdataM, generateS3PDFIterationM, generateS3PDFSurveyAssignmentM, getPdfContentM, getPdfGeneratedForCoachScreen } from '../models/convertURLtoPDFM.js';
import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import axios, * as others from 'axios';
import db from '../config/database.js'
import util from 'util';
const getPdfContentMAsync = util.promisify(getPdfContentM);

// old codes of merging html and URL including multiple insert
export const convertURLtoPDF = async (req, res) => {
  const maxRetries = 100;
  const delayMs = 5000;

  async function convertURLtoPDFAttempt() {
    const tokenCheckResult = check_token(req.header("token"));

    if (tokenCheckResult !== 200) {
      return res.status(tokenCheckResult).send("");
    }

    const params = req.body;
    const pdfDataList = [];
    const s3 = new S3Client({
      region: 'eu-west-2',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS,
      },
    });
    const bucketName = 'ts-s3-uat';

    for (let i = 0; i < params.org_name.length; i++) {
      const folderName = params.org_name[i] + '-' + params.suborg_name[i] + '-' + params.program_name[i] + '-' + params.iteration_name[i] + '-' + params.ind_id[i];
      const fileName = params.first_name[i] + ' ' + params.last_name[i] + ' ' + params.report_template_name[i];

      const urls = [params.current_report[i], params.back_page[i]];
      const htmlText = params.front_page[i];

      const pdfBuffer = await generatePDF(urls, htmlText);

      const s3Key = `Main/${folderName}/${fileName}.pdf`;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: pdfBuffer,
        ContentType: 'application/pdf',
      });

      await s3.send(command);

      // console.log(`uploaded to s3 bucket ${i + 1}`);

      const dataParams = {
        "pdf_file_name": fileName,
        "pdf_path": s3Key,
        "report_template_id": params.report_template_id[i],
        "ind_id": params.ind_id[i],
        "coach_id": params.coach_id[i],
        "faculty_id": params.faculty_id[i],
        "org_id": params.org_id[i],
        "suborg_id": params.suborg_id[i],
        "program_id": params.program_id[i],
        "iteration_id": params.iteration_id[i],
        "group_id": params.group_id[i],
        "created_by": params.created_by,
        "modified_by": params.modified_by,
      };

      pdfDataList.push(dataParams);
    }

    await new Promise((resolve, reject) => {
      addMultiplePDFGeneratedData(pdfDataList, (err, results) => {
        if (err) {
          console.error('Error saving data in pdf_generated table:', err);
          reject(err);
        } else {
          // console.log('Data saved in pdf_generated table:', results);
          resolve(results);
        }
      });
    });

    const folderName = params.org_name[0] + '-' + params.suborg_name[0] + '-' + params.program_name[0] + '-' + params.iteration_name[0] + '-' + params.ind_id[0];
    const fileName = params.first_name[0] + ' ' + params.last_name[0] + ' ' + params.report_template_name[0];

    res.status(200).send({
      "status": "success",
      "bucket name": "ts-s3-uat",
      "pdf file path": `Main/${folderName}/${fileName}.pdf`
    });
  }

  let retries = 0;

  while (retries < maxRetries) {
    try {
      // console.log('try');
      await convertURLtoPDFAttempt();
      break; // If successful, break out of the retry loop
    } catch (error) {
      // Log the error
      // console.error(`Error in convertURLtoPDF (Attempt ${retries + 1}/${maxRetries}):`, error);

      // Increment the retry counter
      retries++;

      // Log the retry attempt
      console.log(`Retrying in ${delayMs / 1000} seconds...`);

      // Wait for a specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  if (retries === maxRetries) {
    // If all retries fail, handle it accordingly
    console.error(`Maximum retries (${maxRetries}) reached. Unable to complete request.`);
    return res.status(500).send({
      "status": "failed",
      "message": "Error generating or uploading PDF"
    });
  }
};

// automated convertion of url to pdf using cron
export const cronConvertURLtoPDF = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  getAllParameters((err, results) => {
    if (err) {
      res.send(err)
    } else {
      res.json(results)
    }
  })
}

// get lists of pdf files
export const getPdfList = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS,
    },
  });
  const bucketName = process.env.S3_BUCKET_NAME;

  const listObjectsParams = {
    Bucket: bucketName,
  };

  try {
    const response = await s3.send(new ListObjectsV2Command(listObjectsParams));

    // Filter objects to get only PDF files
    const pdfFiles = response.Contents.filter(obj => obj.Key.endsWith('.pdf'));

    // Print the list of PDF files
    pdfFiles.forEach(pdfFile => console.log(pdfFile.Key));

    const pdfFileKeys = pdfFiles.map(pdfFile => pdfFile.Key);
    // Send the list of PDF file keys as a response
    res.status(200).json(pdfFileKeys);

  } catch (error) {
    res.status(500).send('Error getting pdf files from S3');
    console.error('Error listing PDF files from S3:', error);
  }
}

// read pdf content 
export const getPdfContent = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  // get result from model
  const results = await getPdfContentMAsync(req.body);

  const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS,
    },
  });
  const bucketName = process.env.S3_BUCKET_NAME;
  const key = results.pdfPath;

  try {
    // Create a command to get the object from S3
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Send the command to S3
    const response = await s3.send(command);

    // Set content type to application/pdf
    res.contentType('application/pdf');

    // Pipe the S3 stream directly to the response
    response.Body.pipe(res);

  } catch (error) {
    if (error) {
      console.error('File not found from S3:', error);
      res.status(500).send('File not found from S3');
    }
    else {
      console.error('Error reading PDF from S3:', error);
      res.status(500).send('Error reading PDF from S3');
    }
  }
}

// function to combine Front page, Current report and Back page
async function combineHTMLandURL(urlReport, htmlFrontPage, htmlBackPage) {
  const browser = await puppeteer.launch({
    executablePath: process.env.S3_EXECUTABLE_PATH,
    args: ['--no-sandbox']
  });

  const pdfDoc = await PDFDocument.create();


  // Convert Front Page HTML text to PDF
  // const frontPagePdfBytes = await new Promise((resolve, reject) => {
  //   pdf.create(htmlFrontPage, {
  //     childProcessOptions: {
  //       env: {
  //         OPENSSL_CONF: '/dev/null',
  //       },
  //     },
  //   }).toBuffer((err, buffer) => {
  //     if (err) reject(err);
  //     resolve(buffer);
  //   });

  // });

  // emil 01.08.2024
  async function waitForImagesToLoad(page) {
    await page.waitForSelector('img', { waitUntil: 'networkidle0' });
  }
  // Convert Front Page HTML text to PDF
  const frontPagePdfBytes = await new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        executablePath: process.env.S3_EXECUTABLE_PATH,
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();

      // Set the content of the page with your HTML
      await page.setContent(htmlFrontPage);

      // Wait for images to load
      await waitForImagesToLoad(page);

      // Convert the page to PDF buffer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        scale: 0.7,
        printBackground: true
      }
      );

      // Close the browser
      await browser.close();

      resolve(pdfBuffer);
    } catch (err) {
      reject(err);
    }
  });

  // frontPagePdfBytes.waitForSelector('img', { waitUntil: 'networkIdle0' })
  // browser.waitForSelector('img', { waitUntil: 'networkIdle0' })

  const frontPagePdfDoc = await PDFDocument.load(frontPagePdfBytes);
  const frontPageCopiedPages = await pdfDoc.copyPages(frontPagePdfDoc, frontPagePdfDoc.getPageIndices());
  frontPageCopiedPages.forEach((copiedPage) => {
    pdfDoc.addPage(copiedPage);
  });

  // Add Current Report from URL
  const page = await browser.newPage();

  try {
    // await page.goto(urlReport, { waitUntil: 'networkidle0', timeout: 60000 }); // Increase the timeout duration
    await page.goto(urlReport, { waitUntil: 'networkidle0', timeout: 60000 }); // Increase the timeout duration
    await page.waitForTimeout(2000); // Additional wait to ensure all dynamic content is loaded
  } catch (error) {
    console.error(`Error navigating to ${urlReport}:`, error.message);
    await browser.close();
    throw error; // Re-throw the error to indicate the failure
  }

  const urlReportPdfBytes = await page.pdf({
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: true,
    scale: 1
  });

  const urlReportPdfDoc = await PDFDocument.load(urlReportPdfBytes);
  const urlReportCopiedPages = await pdfDoc.copyPages(urlReportPdfDoc, urlReportPdfDoc.getPageIndices());
  urlReportCopiedPages.forEach((copiedPage) => {
    pdfDoc.addPage(copiedPage);
  });

  await page.close();

  // Convert Back Page HTML text to PDF
  // const backPagePdfBytes = await new Promise((resolve, reject) => {
  //   pdf.create(htmlBackPage, {
  //     childProcessOptions: {
  //       env: {
  //         OPENSSL_CONF: '/dev/null',
  //       },
  //     },
  //   }).toBuffer((err, buffer) => {
  //     if (err) reject(err);
  //     resolve(buffer);
  //   });
  // });

  // Convert Front Page HTML text to PDF
  const backPagePdfBytes = await new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        executablePath: process.env.S3_EXECUTABLE_PATH,
        args: ['--no-sandbox']
      });
      const page = await browser.newPage();
      await page.setContent(htmlBackPage);
      await waitForImagesToLoad(page);
      const pdfBuffer = await page.pdf({
        format: 'A4',
        scale: 1
      });
      await browser.close();

      resolve(pdfBuffer);
    } catch (err) {
      reject(err);
    }
  });

  const backPagePdfDoc = await PDFDocument.load(backPagePdfBytes);
  const backPageCopiedPages = await pdfDoc.copyPages(backPagePdfDoc, backPagePdfDoc.getPageIndices());
  backPageCopiedPages.forEach((copiedPage) => {
    pdfDoc.addPage(copiedPage);
  });

  await browser.close();

  return pdfDoc.save();
}

// convert tokens
async function convertTokenData(req, templateType) {
  const params = req.body;

  let mergedSubjectAndBody = ""

  // let getTemplate = node_baseurl + 'get-email-template-by-template-type/' + templateType + '/org/' + params.org_id + '/suborg/' + params.suborg_id + '/program/' + params.program_id;
  let getTemplate = node_baseurl + 'get-email-template-by-template-type/' + templateType + '/org/427/suborg/0/program/0';
  await axios.get(getTemplate, { headers: { "token": valid_token } })
    .then(async resp => {

      let s2_subject = resp.data.subject;
      let s2_email_body = resp.data.email_body;
      let s2_email_template_id = resp.data.email_template_id;

      let tokenValues = node_baseurl + 'get-token-values/' + params.survey_assignment_id;
      // console.log("tokenValues: " + tokenValues);
      await axios.get(tokenValues, { headers: { "token": valid_token } })
        .then(resp => {

          let s3_user_full_name = resp.data.user_full_name;
          let s3_email = resp.data.email;
          let s3_logged_in = resp.data.logged_in;
          let s3_recipient_email = resp.data.recipient_email;
          let s3_nominee_salutation = resp.data.nominee_salutation;
          let s3_nominee_message = resp.data.nominee_message;
          let s3_program_name = resp.data.program_name;
          let s3_org_name = resp.data.org_name;
          let s3_website_url = resp.data.website_url;
          let s3_website_sender_email = resp.data.website_sender_email;
          let s3_website_terms_url = resp.data.website_terms_url;
          let s3_website_privacy_url = resp.data.website_privacy_url;
          let s3_website_contact_email = resp.data.website_contact_email;
          let s3_survey_initial_close_date = resp.data.survey_initial_close_date;
          let s3_survey_template_name = resp.data.survey_template_name;
          let s3_survey_description = resp.data.survey_description;
          let s3_suborg_name = resp.data.suborg_name;
          let s3_days_until_survey_close_date = resp.data.days_until_survey_close_date;
          let s3_survey_subject_full_name = resp.data.survey_subject_full_name;
          let s3_survey_subject_first_name = resp.data.survey_subject_first_name;
          let s3_iteration_name = resp.data.iteration_name;
          let s3_survey_active_reminders = resp.data.survey_active_reminders;

          // to convert date like dd Month yyyy
          function convertDateFormat(inputDate) {
            const months = [
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const unixTimestamp = Date.parse(inputDate.replace(/-/g, ' '));

            if (isNaN(unixTimestamp)) {
              return 'Invalid date format';
            }
            const convertedDate = new Date(unixTimestamp);

            const day = String(convertedDate.getDate()).padStart(2, '0');
            const month = months[convertedDate.getMonth()];
            const year = convertedDate.getFullYear();

            return `${day} ${month} ${year}`;
          }

          const inputDateString = resp.data.survey_initial_close_date;
          const convertedDate = convertDateFormat(inputDateString);
          // console.log(convertedDate);

          // emil for downloaded time and date
          let datenow = new Date()
          let hours = datenow.getHours()
          let minutes = datenow.getMinutes()
          let timenow = `${hours}:${minutes}`
          let datetoday = `${datenow.getDate()} ${datenow.toLocaleString('en-US', { month: 'long' })} ${datenow.getFullYear()}`
          //end for downloaded time and date
          let s3_report_title = resp.data.report_title;
          let s3_participant_report_release_date = convertedDate;
          let s3_date_and_time_pdf_created = resp.data.date_and_time_pdf_created;
          let s3_downloaded_by = resp.data.downloaded_by;
          let s3_downloaded_time = timenow;
          let s3_downloaded_date = datetoday;
          let s3_ts_logo = resp.data.ts_logo;

          let s3_brand_path = resp.data.brand_path;
          let s3_header_bg_color = resp.data.header_bg_color;

          if (s2_subject == null) {
            s2_subject = "Please inform your email template manager to create an email template for " + email_template_type;
          }

          if (s3_user_full_name == null) {
            s3_user_full_name = " ";
          }
          if (s3_nominee_salutation == null) {
            s3_nominee_salutation = " ";
          }
          if (s3_nominee_message == null) {
            s3_nominee_message = " ";
          }
          if (s3_program_name == null) {
            s3_program_name = " ";
          }

          if (s3_survey_initial_close_date == null) {
            s3_survey_initial_close_date = " ";
          }
          if (s3_days_until_survey_close_date < 0) {
            s3_days_until_survey_close_date = "already closed";
          }
          if (s3_survey_subject_full_name == null) {
            s3_survey_subject_full_name = " ";
          }
          if (s3_survey_subject_first_name == null) {
            s3_survey_subject_first_name = " ";
          }
          if (s3_iteration_name == null) {
            s3_iteration_name = " ";
          }

          s2_subject = s2_subject.replaceAll("$USER_FULL_NAME$", s3_user_full_name);
          s2_subject = s2_subject.replaceAll("$USER_EMAIL$", s3_email);
          s2_subject = s2_subject.replaceAll("$RECIPIENT_EMAIL$", s3_recipient_email);
          s2_subject = s2_subject.replaceAll("$NOMINEE_SALUTATION$", s3_nominee_salutation);
          s2_subject = s2_subject.replaceAll("$NOMINEE_MESSAGE$", s3_nominee_message);
          s2_subject = s2_subject.replaceAll("$SURVEY_PROGRAM_NAME$", s3_program_name);
          s2_subject = s2_subject.replaceAll("$ORG_NAME$", s3_org_name);
          s2_subject = s2_subject.replaceAll("$WEBSITE_URL$", s3_website_url);
          s2_subject = s2_subject.replaceAll("$WEBSITE_SENDER_EMAIL$", s3_website_sender_email);
          s2_subject = s2_subject.replaceAll("$WEBSITE_TERMS_URL$", s3_website_terms_url);
          s2_subject = s2_subject.replaceAll("$WEBSITE_PRIVACY_URL$", s3_website_privacy_url);
          s2_subject = s2_subject.replaceAll("$WEBSITE_CONTACT_EMAIL$", s3_website_contact_email);
          s2_subject = s2_subject.replaceAll("$SURVEY_INITIAL_CLOSE_DATE$", s3_survey_initial_close_date);
          s2_subject = s2_subject.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
          s2_subject = s2_subject.replaceAll("$SURVEY_DESCRIPTION$", s3_survey_description);
          s2_subject = s2_subject.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
          s2_subject = s2_subject.replaceAll("$DAYS_UNTIL_SURVEY_CLOSE_DATE$", s3_days_until_survey_close_date);
          s2_subject = s2_subject.replaceAll("$SURVEY_SUBJECT_FULL_NAME$", s3_survey_subject_full_name);
          s2_subject = s2_subject.replaceAll("$SURVEY_SUBJECT_FIRST_NAME$", s3_survey_subject_first_name);
          s2_subject = s2_subject.replaceAll("$SURVEY_ITERATION_NAME$", s3_iteration_name);
          s2_subject = s2_subject.replaceAll("$SURVEY_ACTIVE_REMINDERS$", s3_survey_active_reminders);
          s2_subject = s2_subject.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
          let s3_website_url_link = "<a href =" + s3_website_url + "> Click Here </a>";

          if (s3_logged_in == 1) {
            s2_subject = s2_subject.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
          }

          //SURVEY_SUB_ORGANIZATION_NAME
          //SUBORG_NAME
          if (s2_email_template_id == null) {
            s2_email_template_id = 0;
          }
          if (s3_website_sender_email == null) {
            s3_website_sender_email = "help@talentsage.com";
          }
          if (s3_recipient_email == null) {
            s3_recipient_email = "help@talentsage.com";
          }

          if (s2_email_body == null) {
            s2_email_body = "Please inform your email template manager to create an email template for " + email_template_type;
          }
          //logo 
          if (s3_header_bg_color == null) {
            s3_header_bg_color = "#ffffff";
          }

          let s3_logo = '<div style="background:' + s3_header_bg_color + '; display:flex; padding: 10px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);"> <img style="max-width: 100%; height: 60px;" src="' + s3_website_url + s3_brand_path + '/logo.png" alt="Brand Logo"/> </div>';

          s2_email_body = s2_email_body.replaceAll("$LOGO$", s3_logo);

          s2_email_body = s2_email_body.replaceAll("$USER_FULL_NAME$", s3_user_full_name);
          s2_email_body = s2_email_body.replaceAll("$USER_EMAIL$", s3_email);
          s2_email_body = s2_email_body.replaceAll("$RECIPIENT_EMAIL$", s3_recipient_email);
          s2_email_body = s2_email_body.replaceAll("$NOMINEE_SALUTATION$", s3_nominee_salutation);
          s2_email_body = s2_email_body.replaceAll("$NOMINEE_MESSAGE$", s3_nominee_message);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_PROGRAM_NAME$", s3_program_name);
          s2_email_body = s2_email_body.replaceAll("$ORG_NAME$", s3_org_name);
          s2_email_body = s2_email_body.replaceAll("$WEBSITE_URL$", s3_website_url);
          s2_email_body = s2_email_body.replaceAll("$WEBSITE_SENDER_EMAIL$", s3_website_sender_email);
          s2_email_body = s2_email_body.replaceAll("$WEBSITE_TERMS_URL$", s3_website_terms_url);
          s2_email_body = s2_email_body.replaceAll("$WEBSITE_PRIVACY_URL$", s3_website_privacy_url);
          s2_email_body = s2_email_body.replaceAll("$WEBSITE_CONTACT_EMAIL$", s3_website_contact_email);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_INITIAL_CLOSE_DATE$", s3_survey_initial_close_date);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_DESCRIPTION$", s3_survey_description);

          s2_email_body = s2_email_body.replaceAll("$SUBORG_NAME$", s3_suborg_name);

          s2_email_body = s2_email_body.replaceAll("$DAYS_UNTIL_SURVEY_CLOSE_DATE$", s3_days_until_survey_close_date);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUBJECT_FULL_NAME$", s3_survey_subject_full_name);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUBJECT_FIRST_NAME$", s3_survey_subject_first_name);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_ITERATION_NAME$", s3_iteration_name);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_ACTIVE_REMINDERS$", s3_survey_active_reminders);
          s2_email_body = s2_email_body.replaceAll("$SURVEY_TEMPLATE_NAME$", s3_survey_template_name);


          // emil 01.05.2023 GUIDE FOR TOKENS
          s2_email_body = s2_email_body.replaceAll("$REPORT_TITLE$", s3_report_title);
          s2_email_body = s2_email_body.replaceAll("$PARTICIPANT_REPORT_RELEASE_DATE$", s3_participant_report_release_date);
          s2_email_body = s2_email_body.replaceAll("$DATE_AND_TIME_PDF_CREATED$", s3_date_and_time_pdf_created);
          s2_email_body = s2_email_body.replaceAll("$DOWNLOADED_BY$", s3_downloaded_by);
          s2_email_body = s2_email_body.replaceAll("$DOWNLOADED_TIME$", s3_downloaded_time);
          s2_email_body = s2_email_body.replaceAll("$DOWNLOADED_TIME$", s3_downloaded_time);
          s2_email_body = s2_email_body.replaceAll("$DOWNLOADED_DATE$", s3_downloaded_date);
          s2_email_body = s2_email_body.replaceAll("$TS_LOGO$", s3_ts_logo);

          s2_email_body = s2_email_body.replaceAll("$SURVEY_SUB_ORGANIZATION_NAME$", s3_suborg_name);
          if (s3_logged_in == 1) {
            s2_email_body = s2_email_body.replaceAll("$CHOOSE_PASSWORD_LINK$", s3_website_url_link);
          }

          // use this incase subject needed to show in the pdf
          // mergedSubjectAndBody = "<div><p>" + s2_subject + "</p>" +s2_email_body + "</div>";
          mergedSubjectAndBody = s2_email_body
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }

        });
      //res.json(resp.data);
    })
    .catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });

  return mergedSubjectAndBody
}

// remove spacing of pdf file name
function removeSpaces(inputString) {
  return inputString.replace(/\s/g, '');
}

// create PDF per survey_assignment_id by JHUN 360 reports only for now
export const createPDFbySurveyAssignmentID = async (req, res) => {
  // Check token
  const tokenStatus = check_token(req.header("token"));
  if (tokenStatus !== 200) {
    return res.status(tokenStatus).send("");
  }

  // Query survey_assignment table
  db.query(`SELECT * FROM survey_assignment WHERE survey_assignment_id = 23761`, async (err, surveyAssignmentResults) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Check if survey_assignmentResults is not empty
    if (surveyAssignmentResults.length === 0) {
      return res.status(404).send("Survey assignment not found");
    }

    // Extract org_id, suborg_id, survey_template_id, and ind_id from survey_assignmentResults
    const orgId = surveyAssignmentResults[0].org_id;
    const suborgId = surveyAssignmentResults[0].suborg_id;
    const surveyTemplateId = surveyAssignmentResults[0].survey_template_id;
    const indId = surveyAssignmentResults[0].ind_id;

    // Query brand table using org_id and suborg_id
    const sqlQuery = `
      SELECT *
      FROM brand b
      JOIN (
          SELECT COALESCE(
              (
                  SELECT brand_id FROM brand
                  WHERE org_id = ?
                  AND suborg_id = ?
                  LIMIT 1
              ),
              (
                  SELECT brand_id FROM brand
                  WHERE org_id = ?
                  AND suborg_id = 0
                  LIMIT 1
              )
          ) AS brand_id
      ) AS bid ON bid.brand_id = b.brand_id
    `;

    db.query(sqlQuery, [orgId, suborgId, orgId], async (err, brandResults) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Query report_template table using survey_template_id
      db.query(`SELECT * FROM report_template WHERE survey_template_id = ? AND is_coach_report = 0 AND is_group_report = 0`, [surveyTemplateId], async (err, reportTemplateResults) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Query individual table using ind_id
        db.query(`SELECT first_name, last_name FROM individual WHERE ind_id = ?`, [indId], async (err, individualResults) => {
          if (err) {
            return res.status(500).send(err);
          }

          // Combine results from all four queries
          const combinedResults = {
            surveyAssignment: surveyAssignmentResults[0],
            brand: brandResults[0],
            reportTemplate: reportTemplateResults[0],
            individual: individualResults.length > 0 ? { ...individualResults[0], first_name: `${individualResults[0].first_name} ` } : null
          };

          // Construct final URL
          const finalURL =
            combinedResults.brand.website_url +
            combinedResults.reportTemplate.report_file +
            '?sex=null&country=null&viewer_fullname=' + (combinedResults.individual ? combinedResults.individual.first_name + combinedResults.individual.last_name : '') +
            '&report_for_fullname=' + (combinedResults.individual ? combinedResults.individual.first_name + combinedResults.individual.last_name : '') +
            '&survey_assignment_id=' + combinedResults.surveyAssignment.survey_assignment_id +
            '&org_id=' + combinedResults.surveyAssignment.org_id +
            '&subOrg_id=' + combinedResults.surveyAssignment.suborg_id +
            '&program_id=' + combinedResults.surveyAssignment.program_id +
            '&iteration_id=' + combinedResults.surveyAssignment.iteration_id +
            '&rand=' + Math.random() + '&expand_all=true';

          // Use createPDF2 function as the final result
          const createPDFResult = await createPDF2({
            body: {
              header: {
                token: req.header("token"),
                // Add other headers if needed
              },
              org_id: combinedResults.surveyAssignment.org_id,
              suborg_id: 0,
              program_id: 0,
              survey_assignment_id: combinedResults.surveyAssignment.survey_assignment_id,
              current_report: finalURL
            }
          });

          // Send the createPDF result as the final response
          res.json(createPDFResult);
        });
      });
    });
  });
};

// create PDF2 
export const createPDF2 = async (req, res) => {
  if ((check_token(req.body.header.token)) !== 200) return res.status(check_token(req.body.header.token)).send("")

  const params = req.body;
  const urlReport = params.current_report;

  const frontPageTemplateType = "Front Page"
  const frontPageHtmlData = await convertTokenData(req, frontPageTemplateType)

  const backPageTemplateType = "Back Page"
  const backPageHtmlData = await convertTokenData(req, backPageTemplateType)

  try {
    const pdfBuffer = await combineHTMLandURL(urlReport, frontPageHtmlData, backPageHtmlData);

    return {
      status: "success",
      message: "PDF has been created",
      pdfBuffer: pdfBuffer
    };
  } catch (error) {
    console.error('From CreatePdf2: Error in convertURLtoPDF:', error);
    return {
      status: "failed",
      message: "Error in creating PDF",
      pdfBuffer: null
    };
  }
};

// create PDF
export const createPDF = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  const params = req.body;
  const urlReport = params.current_report;

  const frontPageTemplateType = "Front Page"
  const frontPageHtmlData = await convertTokenData(req, frontPageTemplateType)

  const backPageTemplateType = "Back Page"
  const backPageHtmlData = await convertTokenData(req, backPageTemplateType)

  try {
    const pdfBuffer = await combineHTMLandURL(urlReport, frontPageHtmlData, backPageHtmlData);

    return res.status(200).send({
      "status": "success",
      "message": "PDF has been created",
      "PDF buffer": pdfBuffer
    });
  } catch (error) {
    console.error('From CreatePDF: Error in convertURLtoPDF:', error);
    return res.status(500).send({
      "status": "failed",
      "message": "Error in creating PDF"
    });
  }
};

// upload PDF to S3 Bucket
export const uploadPDF = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

  const params = req.body;
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS,
    },
  });
  const bucketName = process.env.S3_BUCKET_NAME;

  const folderName = `${params.org_name}${params.suborg_name}${params.program_name}${params.iteration_name}${params.ind_id}`
  const fileName = `${params.first_name}${params.last_name}${params.report_template_name}`
  const qsortType = params.qsort_type
  const filePathWithoutSpaces = removeSpaces(`${folderName}/${fileName}${qsortType}`);

  try {
    // console.log("pdf buffer length",params.pdfBuffer)
    const pdfBuffer = Buffer.from(Object.values(params.pdfBuffer));

    const s3Key = `Main/${filePathWithoutSpaces}.pdf`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    });

    await s3.send(command);

    // console.log('Uploaded to S3 bucket');

    res.status(200).send({
      "status": "success",
      "bucket_name": bucketName,
      "pdf_file_path": s3Key
    });
  } catch (error) {
    console.error('From UploadPDF: Error in convertURLtoPDF:', error);
    return res.status(500).send({
      "status": "failed",
      "message": "Error generating or uploading PDF"
    });
  }
};

// insert pdf data in database
export const insertPDFdata = async (req, res) => {
  try {
    if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")

    const data = req.body;

    insertPDFdataM(data, (err, results) => {
      if (err) {
        return res.status(200).json({
          status: "failed",
          message: "Failed to insert data",
          payload: err
        });
      } else {
        return res.json(results)
      }
    });
  } catch (error) {
    console.error("Error in insertPDFdata:", error);
    return res.status(200).json({
      status: "failed",
      message: "Internal Server Error",
      payload: error
    });
  }
};

// create PDF by iteration
export const generateS3PDFIteration = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  generateS3PDFIterationM(req.body.iteration_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      try {
        return res.status(200).send(results);
      } catch (error) {
          console.error('Error in convertURLtoPDF:', error);
          return res.status(500).send({
            status: "failed",
            message: "Error in creating PDFs",
          });
      }
    }
  })
}

// create PDF by survey assignment
export const generateS3PDFSurveyAssignment = async (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  generateS3PDFSurveyAssignmentM(req.body.survey_assignment_id, (err, results) => {
    if (err) {
      res.send(err)
    } else {
      try {
        return res.status(200).send(results);
      } catch (error) {
          console.error('From generates3pdfSurveyAss: Error in convertURLtoPDF:', error);
          return res.status(500).send({
            status: "failed",
            message: "Error in creating PDFs",
          });
      }
    }
  })
}







// export const processGeneratePdf = async (req, res) => {
//   if (check_token(req.header('token')) !== 200) return res.status(check_token(req.header('token'))).send('')

//   const surveyAssignmentList = req.body
//   const surveyAssignmentCount = surveyAssignmentList.length + 1
//   console.log(req.body)
//   try{
//         for (let i = 0; i < surveyAssignmentCount; i++) {
//           // console.log("times to iteration", surveyAssignmentList.length)
//           // console.log("iterating", surveyAssignmentList[i])
//           let generateResults;
//           let uploadResults.data;
//           let pdfInsertDetails;
//           try{
//             let step1_url = `${node_baseurl}generate-s3-pdf-survey-assignment`
//             await axios.post(step1_url, surveyAssignmentList[i], { headers: { "token": valid_token } })
//             .then(async (response)=>{
//               generateResults = response.data
//               // console.log("from generate result:", response.data)
//               try{
//                 let body = {
//                   report_template_name: generateResults.results.reportTemplateNames[0],
//                   first_name: generateResults.results.firstNames[0],
//                   last_name: generateResults.results.lastNames[0],
//                   org_name: generateResults.results.orgName,
//                   suborg_name: generateResults.results.suborgName,
//                   program_name: generateResults.results.programName,
//                   iteration_name: generateResults.results.iterationName,
//                   ind_id: generateResults.results.indIds[0],
//                   qsort_type: generateResults.results.qsortTypes[0],
//                   pdfBuffer: generateResults.results.pdfBuffers[0],
//                   }
  
//                   let step2_url = `${node_baseurl}upload-pdf`
//                   await axios.post(step2_url, body, { 
//                   headers: { "token": valid_token },
//                   maxBodyLength: 104857600, //100mb
//                   maxContentLength: 104857600, //100mb
//                   emulateJSON: true  })
//                     .then(async (response)=>{
//                       // console.log("step 2",generateResults)
//                       uploadResults = response.data
//                       try{
//                         let body = {
//                           pdf_file_name: generateResults.results.fullNames[0] + 
//                           generateResults.results.reportTemplateNames[0]+'.pdf',
//                           pdf_path: uploadResults.pdf_file_path,
//                           report_template_id: generateResults.results.reportTemplateIds[0],
//                           ind_id: generateResults.results.indIds[0],
//                           survey_assignment_id: generateResults.results.surveyAssignmentIds[0],
//                           s3_bucket: process.env.S3_BUCKET_NAME,
//                           coach_id: generateResults.results.coachIds[0],
//                           org_id: generateResults.results.orgId,
//                           suborg_id: generateResults.results.suborgId,
//                           program_id: generateResults.results.programId,
//                           iteration_id: generateResults.results.iterationId,
//                           stream_id: generateResults.results.streamIds[0],
//                           group_id: generateResults.results.groupIds[0],
//                           created_by: 1,
//                           modified_by: 1,
//                         }
//                         let step3_url = `${node_baseurl}insert-pdf-data`
//                         await axios.post(step3_url, body, { headers: { "token": valid_token } })
//                         .then((response)=>{
//                           // console.log("step 3",uploadResults)
//                           console.log(response.data)
//                           pdfInsertDetails = response.data.length

//                           let myResp = {}
//                           myResp = { 'PDF details save in pdf generated table': pdfInsertDetails }
//                           res.json(myResp)
//                         })
//                       }catch(error){
//                         console.error(error.response.data);
//                       }
//                     })
//               }catch(error){
//                 console.error(error.response.data);
//               }
//             })
//           }catch(error){
//             console.error(error.response.data);
//           }
//     }
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error('Axios error:', error.message);
//       console.error('Response data:', error.response.data);
//       console.error('Response status:', error.response.status);
//     } else {
//       console.error('Other error:', error.message);
//     }
//     }
// }

export const processGeneratePdf = async (req, res) => {
  try {
    const tokenStatus = check_token(req.header('token'));
    if (tokenStatus !== 200) {
      return res.status(tokenStatus).send('');
    }

    const surveyAssignmentList = req.body;

    for (const assignment of surveyAssignmentList) {
      try {
        const generateResults = await axios.post(`${node_baseurl}generate-s3-pdf-survey-assignment`, assignment, {
          headers: { "token": valid_token }
        });
        const reportTemplateNames = generateResults.data.results.reportTemplateNames;

        for (let i = 0; i < reportTemplateNames.length; i++) {
          const body = {
            report_template_name: generateResults.data.results.reportTemplateNames[i],
            first_name: generateResults.data.results.firstNames[i],
            last_name: generateResults.data.results.lastNames[i],
            org_name: generateResults.data.results.orgName,
            suborg_name: generateResults.data.results.suborgName,
            program_name: generateResults.data.results.programName,
            iteration_name: generateResults.data.results.iterationName,
            ind_id: generateResults.data.results.indIds[i],
            qsort_type: generateResults.data.results.qsortTypes[i],
            pdfBuffer: generateResults.data.results.pdfBuffers[i],
        };

          const uploadResults = await axios.post(`${node_baseurl}upload-pdf`, body, {
            headers: { "token": valid_token },
            maxBodyLength: 104857600, // 100mb
            maxContentLength: 104857600, // 100mb
            emulateJSON: true
          });

          const pdfDetailsBody = {

            pdf_file_name: generateResults.data.results.fullNames[i] + 
            generateResults.data.results.reportTemplateNames[i]+'.pdf',
            pdf_path: uploadResults.data.pdf_file_path,
            report_template_id: generateResults.data.results.reportTemplateIds[i],
            ind_id: generateResults.data.results.indIds[i],
            survey_assignment_id: generateResults.data.results.surveyAssignmentIds[i],
            s3_bucket: process.env.S3_BUCKET_NAME,
            coach_id: generateResults.data.results.coachIds[i],
            org_id: generateResults.data.results.orgId,
            suborg_id: generateResults.data.results.suborgId,
            program_id: generateResults.data.results.programId,
            iteration_id: generateResults.data.results.iterationId,
            stream_id: generateResults.data.results.streamIds[i],
            group_id: generateResults.data.results.groupIds[i],
            created_by: 1,
            modified_by: 1,
          // ... other properties
        };

          await axios.post(`${node_baseurl}insert-pdf-data`, pdfDetailsBody, {
            headers: { "token": valid_token }
          });
        }

      } catch (error) {
        handleAxiosError(error);
      }
    }

    res.json({ 'PDF details save in pdf generated table': surveyAssignmentList.length });

  } catch (error) {
    handleGeneralError(error, res);
  }
};

const handleAxiosError = (error) => {
  if (axios.isAxiosError(error)) {
    console.error('Axios error:', error.message);
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
  } else {
    console.error('Other error:', error.message);
  }
};

const handleGeneralError = (error, res) => {
  console.error('General error:', error.message);
  res.status(500).send('Internal Server Error');
};


export const showPdfGeneratedForCoachScreen = (req, res) => {
  if ((check_token(req.header("token"))) !== 200) return res.status(check_token(req.header("token"))).send("")
  const data = req.body;
  getPdfGeneratedForCoachScreen(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};