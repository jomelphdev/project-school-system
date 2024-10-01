export const replaceTokens = (data, tokenObj, password_link, brand_path) => {
    //replace the tokens to original word
    let mapObjTokens = {
        RECIPIENT_EMAIL: tokenObj.recipient_email ? tokenObj.recipient_email : '',
        WEBSITE_URL: tokenObj.website_url ? tokenObj.website_url : '',
        WEBSITE_CONTACT_EMAIL: tokenObj.website_contact_email ? tokenObj.website_contact_email : '',
        WEBSITE_SENDER_EMAIL: tokenObj.website_sender_email ? tokenObj.website_sender_email : '',
        WEBSITE_TERMS_URL: tokenObj.website_terms_url ? tokenObj.website_terms_url : '',
        WEBSITE_PRIVACY_URL: tokenObj.website_privacy_url ? tokenObj.website_privacy_url : '',
        DAYS_UNTIL_SURVEY_CLOSE_DATE: tokenObj.days_until_survey_close_date ? tokenObj.days_until_survey_close_date : '',
        SURVEY_INITIAL_CLOSE_DATE: new Date(tokenObj.survey_close_date).toString().slice(4, 21),
        SURVEY_DESCRIPTION: tokenObj.survey_description ? tokenObj.survey_description : '',
        SURVEY_SUBJECT_FULL_NAME: tokenObj.user_full_name ? tokenObj.user_full_name : '',
        SURVEY_SUBJECT_FIRST_NAME: tokenObj.first_name ? tokenObj.first_name : '',
        SURVEY_SUB_ORGANIZATION_NAME: tokenObj.suborg_name ? tokenObj.suborg_name : '',
        USER_SUB_ORGANIZATION_NAME: tokenObj.suborg_name ? tokenObj.suborg_name : '',
        SURVEY_PROGRAM_NAME: tokenObj.program_name ? tokenObj.program_name : '',
        SURVEY_ITERATION_NAME: tokenObj.iteration_name ? tokenObj.iteration_name : '',
        SURVEY_TEMPLATE_NAME: tokenObj.survey_template_name ? tokenObj.survey_template_name : '',
        SURVEY_ACTIVE_REMINDERS: tokenObj.survey_active_reminders ? tokenObj.survey_active_reminders : '',
        NOMINEE_SALUTATION: tokenObj.nominee_salutation ? tokenObj.nominee_salutation : '',
        NOMINEE_MESSAGE: tokenObj.nominee_message ? tokenObj.nominee_message : '',
        USER_FULL_NAME: tokenObj.user_full_name ? tokenObj.user_full_name : tokenObj.nominee_salutation,
        USER_EMAIL: tokenObj.email ? tokenObj.email : '',
        CHOOSE_PASSWORD_LINK: password_link ? password_link : '',
        // LOGO: `<div style="background: ${tokenObj.header_bg_color ? tokenObj.header_bg_color : '#ffffff'}; display:flex; padding: 5px; height: 60px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
        //         <img src="${tokenObj.website_url + '' + tokenObj.brand_path}/logo.png" alt="Brand Logo"/>
        //       </div>`,
        LOGO: `<div style="background: ${tokenObj.header_bg_color ? tokenObj.header_bg_color : '#ffffff'}; display:flex; padding: 5px; height: 60px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                <img src="${tokenObj.website_url + '' + brand_path}/logo.png" alt="Brand Logo"/>
              </div>`,
        PARTICIPANT_REPORT_RELEASE_DATE: tokenObj.participant_report_release_date ? tokenObj.participant_report_release_date : '',
        PDF_DATE_CREATED: tokenObj.pdf_date_created ? tokenObj.pdf_date_created : '',
        PDF_TIME_CREATED: tokenObj.pdf_time_created ? tokenObj.pdf_time_created : '',
        REPORT_TITLE: tokenObj.report_title ? tokenObj.report_title : '',
    };

    // remove the dollar sign
    const replaceDollar = data.replaceAll('$', '');
    const replaceLogo = replaceDollar.replaceAll('<strong>LOGO</strong>', 'LOGO');


    // display the sentence with converted tokens
    const convertedData = replaceLogo.replace(/LOGO|USER_EMAIL|RECIPIENT_EMAIL|WEBSITE_URL|NOMINEE_SALUTATION|NOMINEE_MESSAGE|SURVEY_PROGRAM_NAME|SURVEY_SUB_ORGANIZATION_NAME|USER_SUB_ORGANIZATION_NAME|WEBSITE_SENDER_EMAIL|WEBSITE_TERMS_URL|WEBSITE_PRIVACY_URL|WEBSITE_CONTACT_EMAIL|SURVEY_INITIAL_CLOSE_DATE|DAYS_UNTIL_SURVEY_CLOSE_DATE|SURVEY_TEMPLATE_NAME|SURVEY_ACTIVE_REMINDERS|SURVEY_DESCRIPTION|USER_FULL_NAME|SURVEY_SUBJECT_FIRST_NAME|SURVEY_SUBJECT_FULL_NAME|SURVEY_ITERATION_NAME|REPORT_TITLE|PARTICIPANT_REPORT_RELEASE_DATE|DATE_AND_TIME_PDF_CREATED|DOWNLOADED_BY|DOWNLOADED_TIME|DOWNLOADED_DATE|PDF_DATE_CREATED|PDF_TIME_CREATED|REPORT_TITLE|ORG_LOGO|TS_LOGO|CHOOSE_PASSWORD_LINK/g, function (matched) {

        return mapObjTokens[matched];
    });
    return convertedData
}

// this is only for making a nomination screen 
export const replaceTokensForNomination = (data, tokenObj, password_link, nominee_salutation, nominee_message, recipient_email) => {
    // let tokenObj = tokens

    //replace the tokens to original word
    let mapObjTokens = {
        WEBSITE_URL: tokenObj.website_url,
        WEBSITE_CONTACT_EMAIL: tokenObj.website_contact_email,
        WEBSITE_SENDER_EMAIL: tokenObj.website_sender_email,
        WEBSITE_TERMS_URL: tokenObj.website_terms_url,
        WEBSITE_PRIVACY_URL: tokenObj.website_privacy_url,
        DAYS_UNTIL_SURVEY_CLOSE_DATE: tokenObj.days_until_survey_close_date,
        SURVEY_INITIAL_CLOSE_DATE: new Date(tokenObj.survey_close_date).toString().slice(4, 21),
        SURVEY_DESCRIPTION: tokenObj.survey_description,
        SURVEY_SUB_ORGANIZATION_NAME: tokenObj.suborg_name,
        USER_SUB_ORGANIZATION_NAME: tokenObj.suborg_name,
        SURVEY_PROGRAM_NAME: tokenObj.program_name,
        SURVEY_ITERATION_NAME: tokenObj.iteration_name,
        SURVEY_TEMPLATE_NAME: tokenObj.survey_template_name,
        SURVEY_ACTIVE_REMINDERS: tokenObj.survey_active_reminders,
        NOMINEE_MESSAGE: nominee_message,
        USER_FULL_NAME: tokenObj.user_full_name,
        USER_EMAIL: tokenObj.email,
        CHOOSE_PASSWORD_LINK: password_link,
        NOMINEE_SALUTATION: nominee_salutation,
        SURVEY_SUBJECT_FULL_NAME: tokenObj.user_full_name,
        SURVEY_SUBJECT_FIRST_NAME: tokenObj.first_name,
        RECIPIENT_EMAIL: recipient_email,
        LOGO: `<div style="background: ${tokenObj.header_bg_color ? tokenObj.header_bg_color : '#ffffff'}; display:flex; padding: 5px; height: 60px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                <img src="${tokenObj.website_url + '' + tokenObj.brand_path}/logo.png" alt="Brand Logo"/>
              </div>`,
    };

    // remove the dollar sign
    const replaceDollar = data.replaceAll('$', '');

    // display the sentence with converted tokens
    const convertedData = replaceDollar.replace(/LOGO|USER_EMAIL|RECIPIENT_EMAIL|WEBSITE_URL|NOMINEE_SALUTATION|NOMINEE_MESSAGE|SURVEY_PROGRAM_NAME|SURVEY_SUB_ORGANIZATION_NAME|USER_SUB_ORGANIZATION_NAME|WEBSITE_SENDER_EMAIL|WEBSITE_TERMS_URL|WEBSITE_PRIVACY_URL|WEBSITE_CONTACT_EMAIL|SURVEY_INITIAL_CLOSE_DATE|DAYS_UNTIL_SURVEY_CLOSE_DATE|SURVEY_TEMPLATE_NAME|SURVEY_ACTIVE_REMINDERS|SURVEY_DESCRIPTION|USER_FULL_NAME|SURVEY_SUBJECT_FIRST_NAME|SURVEY_SUBJECT_FULL_NAME|SURVEY_ITERATION_NAME|REPORT_TITLE|PARTICIPANT_REPORT_RELEASE_DATE|DATE_AND_TIME_PDF_CREATED|DOWNLOADED_BY|DOWNLOADED_TIME|DOWNLOADED_DATE|ORG_LOGO|TS_LOGO|CHOOSE_PASSWORD_LINK/gi, function (matched) {
        return mapObjTokens[matched];
    });

    return convertedData
}

export const replaceTokensForUpdateEmail = (data, tokenObj, password_link, recipient_email) => {
    // let tokenObj = tokens

    //replace the tokens to original word
    let mapObjTokens = {
        RECIPIENT_EMAIL: recipient_email,
        WEBSITE_URL: tokenObj.website_url,
        WEBSITE_CONTACT_EMAIL: tokenObj.website_contact_email,
        WEBSITE_SENDER_EMAIL: tokenObj.website_sender_email,
        WEBSITE_TERMS_URL: tokenObj.website_terms_url,
        WEBSITE_PRIVACY_URL: tokenObj.website_privacy_url,
        DAYS_UNTIL_SURVEY_CLOSE_DATE: tokenObj.days_until_survey_close_date,
        SURVEY_INITIAL_CLOSE_DATE: new Date(tokenObj.survey_close_date).toString().slice(4, 21),
        SURVEY_DESCRIPTION: tokenObj.survey_description,
        SURVEY_SUBJECT_FULL_NAME: tokenObj.survey_subject_full_name,
        SURVEY_SUBJECT_FIRST_NAME: tokenObj.survey_subject_first_name,
        SURVEY_SUB_ORGANIZATION_NAME: tokenObj.suborg_name,
        USER_SUB_ORGANIZATION_NAME: tokenObj.suborg_name,
        SURVEY_PROGRAM_NAME: tokenObj.program_name,
        SURVEY_ITERATION_NAME: tokenObj.iteration_name,
        SURVEY_TEMPLATE_NAME: tokenObj.survey_template_name,
        SURVEY_ACTIVE_REMINDERS: tokenObj.survey_active_reminders,
        NOMINEE_SALUTATION: tokenObj.nominee_salutation,
        NOMINEE_MESSAGE: tokenObj.nominee_message,
        USER_FULL_NAME: tokenObj.user_full_name,
        USER_EMAIL: tokenObj.email,
        CHOOSE_PASSWORD_LINK: password_link,
        LOGO: `<div style="background: ${tokenObj.header_bg_color ? tokenObj.header_bg_color : '#ffffff'}; display:flex; padding: 5px; height: 60px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);">
                <img src="${tokenObj.website_url + '' + tokenObj.brand_path}/logo.png" alt="Brand Logo"/>
              </div>`,
    };

    // remove the dollar sign
    const replaceDollar = data.replaceAll('$', '');

    // display the sentence with converted tokens
    const convertedData = replaceDollar.replace(/LOGO|USER_EMAIL|RECIPIENT_EMAIL|WEBSITE_URL|NOMINEE_SALUTATION|NOMINEE_MESSAGE|SURVEY_PROGRAM_NAME|SURVEY_SUB_ORGANIZATION_NAME|USER_SUB_ORGANIZATION_NAME|WEBSITE_SENDER_EMAIL|WEBSITE_TERMS_URL|WEBSITE_PRIVACY_URL|WEBSITE_CONTACT_EMAIL|SURVEY_INITIAL_CLOSE_DATE|DAYS_UNTIL_SURVEY_CLOSE_DATE|SURVEY_TEMPLATE_NAME|SURVEY_ACTIVE_REMINDERS|SURVEY_DESCRIPTION|USER_FULL_NAME|SURVEY_SUBJECT_FIRST_NAME|SURVEY_SUBJECT_FULL_NAME|SURVEY_ITERATION_NAMEREPORT_TITLE|PARTICIPANT_REPORT_RELEASE_DATE|DATE_AND_TIME_PDF_CREATED|DOWNLOADED_BY|DOWNLOADED_TIME|DOWNLOADED_DATE|REPORT_TITLE|ORG_LOGO|TS_LOGO|CHOOSE_PASSWORD_LINK/gi, function (matched) {
        return mapObjTokens[matched];
    });

    return convertedData
}

export const flashMessage = (flash, accent_color, text_color, message) => {
    flash.show({
        html: `<div style="background-color: ${accent_color}; width:100%;">
          <p style="margin-left:1rem; color: ${text_color};">${message}</p>
        </div>`,
        clickable: true,
    });
}

export const mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/ // eslint-disable-line
