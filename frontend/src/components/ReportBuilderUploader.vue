<script setup>
import Header from "./Header.vue";
import FileUploader from "./FileUploader.vue";
import Swal from "sweetalert2";
</script>

<template>
  <div class="body-container">
    <div class="container">
      <div
      class="input-file-label">

        <label 
        for="upload-file"><pre>{{ surveyFileName }}</pre></label>

        <input 
        id="upload-file"
        type="file"
        ref="file"
        @change="handleFileUpload" />
      </div>

      <p>or</p>

      <div
      class="input-file-label" >

        <label 
        for="upload-file-rpt"><pre>{{reportFileName}}</pre></label>

        <input
        id="upload-file-rpt"
        type="file"
        ref="file" 
        @change="handleFileUploadRpt" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  component: [Header, FileUploader],
  name: "ReportBuilderUploader",
  props: ["userData", "brandData"],
  beforeCreate() {},
  async created() {
    console.log(this.userData)
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeUnmount() {},
  unmounted() {},
  data: () => ({
    surveyFileName: 'Click here... \n Select a new report using a survey(.srv) file.',
    reportFileName: 'Click here... \n Edit a report using a report(.rpt) file.',
    surveyFileNameWithoutExtension : '',
    originalSurveyName : '',
    originalReportName : '',
    isFileSRV : false,
    list: [],
    parsedList: [],

    jsonSetupHeader : [],
    jsonSetupSection1 : [],
    jsonSetupSection2 : [],
    jsonSetupSection3To8 : [],
    jsonSetupHistogram : [],
    jsonSetupOCS : [],
    jsonSetupCII : [],
    jsonSetupHighestLowest : [],
    jsonSetupBlindSpot : [],
    jsonSetupOEQ : [],
    jsonSetupAppendix : [],
    jsonSetupSectionNPS : [],
  }),
  methods: {
    async onClickButton(file) {
      this.$emit("clicked", ({
        file: file, 
        originalSurveyName: this.originalSurveyName, 
        originalReportName: this.originalReportName, 
        isFileSRV: this.isFileSRV
      }));
    },

    jsonSectionHeader() {
      this.jsonSetupHeader = [
        {
          name: "Header",
          id: "Header",
          Type: "",
          QuestionNumber: "",
          Text: "",
          Template: "",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              name: "Cohort-Data",
              Type: "Toggle",
              QuestionNumber: "",
              Text: "",
              Template: "Cohort-Data",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "Average-Others",
              Type: "Toggle",
              QuestionNumber: "",
              Text: "",
              Template: "Average-Others",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "PDF-Button",
              Type: "Button",
              QuestionNumber: "",
              Text: "",
              Template: "Print-PDF-Button",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "Expand all button",
              Type: "",
              QuestionNumber: "",
              Text: "",
              Template: "Expand-All-with-Toggle-Bar-Chart",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "Histogram",
              Type: "",
              QuestionNumber: "",
              Text: "",
              Template: "Histogram",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "Report name",
              Type: "Heading",
              QuestionNumber: "",
              Text: '',
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "headerInput",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "Report description",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>This report provides specific feedback on your leadership and management skills. The feedback in it is a valuable foundation to help you chart the course of your development for the future.</p><p>To print your report, please 'Expand All' sections before clicking 'Download to PDF'.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              name: "New-360-Report",
              Type: "",
              QuestionNumber: "",
              Text: "",
              Template: "New-360-Report",
              isChecked: true,
            }
          ],
        },
      ];
    },
    jsonSection1() {
      this.jsonSetupSection1 = [
        {
          QuestionNumber: 1,
          Type: "Section",
          Template: "Section",
          Text: "Introduction",
          id: "Introduction",
          name: "Introduction",
          isChecked: true,
          subElements: [
            {
              id: "Introduction",
              subId: "section1Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "Introduction",
              subElement: "Description static message",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: '<div style="display: flex; margin-bottom: 12px"><div><p>Your future success at work depends on your ability to work effectively with groups and individuals such as supervisors, peers, and direct reports who have diverse interests and expectations. In addition, they often have distinct perspectives based on their roles and experiences.</p><p>Information from one group or individual is potentially useful, but receiving evaluations from only one source (e.g. a supervisor) provides a limited perspective. By surveying people with different points of view and expectations, you can gain richer and more relevant information about your impact on all those you work with as well as your current leadership skills to help focus your attention on your most important development needs.</p><p>This leadership skills feedback report will help:</p><ul><li>provide an understanding of how you are perceived by others in your work;</li><li>isolate your leadership strengths and developmental needs;</li><li>identify the competencies most critical to your current position; and</li><li>highlight differences in the evaluations made by different respondent perspectives (e.g. Peers vs. Direct reports).</li></ul><p>The leadership skills feedback report is a diagnostic tool. Real improvement depends on your willingness to reflect on these data, set specific development goals based on your feedback, then systematically work toward achieving these goals. You can make the most progress by keeping a big picture perspective and focusing on 2-3 key goals instead of trying to do everything at once.</p><p>In each report, there is much information to digest. In fact, each time you read your report you are likely to see and learn additional insights. So, as you read your report, look for patterns in your results that suggest particularly important development needs.</p></div><div style="align-self:center"><img src="https://ts.talentsage.com/introduction.png" alt="Intro360" /></div></div><p style="font-style:italic"><strong>Rating groups and confidentiality</strong><br />For the most part, your report feedback will be labelled by the rating group they represent. Results in each category reflect the average scores submitted by the respondents within it.</p>',
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section1Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "Introduction",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: '<p style="font-style:italic"><strong>Norming group</strong><br />Your cohort can be a useful group of peers for comparison. To provide you with some context, your scores are compared to your cohort\'s, participants who have taken the same leadership skills journey with you.</p><p style="font-style:italic"><strong>About this report</strong><br />This report contains your leadership skills feedback results. The report begins with a high-level overview and progresses into greater detail as you proceed through it.</p><p style="font-style:italic">Please read through the entire report and keep an open mind as you look at the numeric data and read the comments from your respondents. Once you have familiarized yourself with the report and your results, go back through the report and look for anomalies, patterns, and themes. Work back and forth between the numeric data and the comments as you do this.</p><p style="font-style:italic">Please keep in mind, differences between your views and your respondents\' views may result from different value systems, contexts or indeed diverging expectations of you.</p><p style="font-style:italic">For these reasons, you should discuss your results with your manager, HR representative, or a coach to better understand the feedback. Try to use these meetings to identify a short list of actionable items for improvement. As natural as it is, try not to determine who said what, but seek instead to understand overall patterns and themes that highlight your strengths and areas for development. If you take this approach, you will already have made a critical step toward becoming a better leader</p>',
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Introduction",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },

    jsonSection2(mergeArrayCompetencies, mergedArrayElements, jsonData) {
      const ciiArr = []
      const maxIndex = jsonData[0].selectedCompetencies.length; // Get the maximum length
      for (let index = 0; index < maxIndex; index++) {
        const newEntry = {
          Trait: `CII${index + 1}`,
          Description: jsonData[0].selectedCompetencies[index]?.competency_name
        };
        ciiArr.push(newEntry);
      }
      console.log('pasok to',ciiArr)

      const netPromoterScore = jsonData.find( (nps) => nps.id === "NetPromoterScore");
      let npsName = ''
      let npsDescription = ''
      
        if (netPromoterScore.questions.length === 0) {
            npsName = ''
            npsDescription = ''
        } else {
            npsName = netPromoterScore.questions[0].nps_name || ''
            npsDescription = netPromoterScore.questions[0].nps_description || ''
        }
      let barchartHeadText;

      if(this.userData.org_id === 427){
        console.log("barchart for smart collab")
        barchartHeadText = {
        SuperTrait: "High_level_competency_scores",
        heading1: "S = Self",
        heading1a: "O",
        heading1b: " = Average All Others",
        heading2: "S = Self",
        heading3: "Dimensions",
        heading4: "Top Behaviours",
        heading5: "Undiscovered Strengths",
        heading6: "Watchouts",
        Colors: {
          color_o: "rgb(88, 89, 87)",
          color_s: "rgb(184, 113, 26)",
          color_ps: "rgb(140,233,154)",
          color_p: "rgb(14, 80, 113)",
          color_d: "rgb(164, 99, 216)",
          color_pd: "rgb(14, 80, 113)",
          color_ie: "rgb(64, 164, 217)",
          color_i: "rgb(64, 164, 217)",
          color_e: "rgb(220, 55, 56)",
          color_pdie: "rgb(14, 80, 113)",
        },
        BarColors: [
          "rgb(192,0,0)",
          "rgb(255,217,102)",
          "rgb(169,209,142)",
          "rgb(169,209,142)",
        ],
        TextColors: ["rgb(197,90,17)", "rgb(84,130,53)"],
        Competencies: mergeArrayCompetencies,
        Elements: mergedArrayElements,
        ciiTitle: "Competency_Importance_Index",
        ciiHeading1: "Competency Importance Index",
        ciiHeading2: jsonData[0].selectedCompetencies[0]?.competency_name ?? '',
        ciiHeading3: jsonData[0].selectedCompetencies[1]?.competency_name ?? '',
        ciiHeading4: jsonData[0].selectedCompetencies[2]?.competency_name ?? '',
        ciiHeading5: jsonData[0].selectedCompetencies[3]?.competency_name ?? '',
        ciiHeading6: jsonData[0].selectedCompetencies[4]?.competency_name ?? '',
        ciiHeading7: jsonData[0].selectedCompetencies[5]?.competency_name ?? '',
        ciiColorSelf: "black",
        ciiColorOthers: "rgb(227, 61, 72)",
        ciiElements: [
          {
            Trait: "CII6",
            Description: "S",
          },
          {
            Trait: "CII5",
            Description: "O",
          },
        ],
        ciiCompetencies: ciiArr,
        ocsTitle: "Organizational Climate Snapshot",
        ocsLabel2: "Emotional Reactivity",
        ocsLabel3: "Extraversion",
        ocsLabel4: "Openness to Change",
        ocsLabel5: "Agreeableness",
        ocsLabel6: "Conscientiousness",
        ocsSuperTrait: "Organizational_climate_breakdown",
        ocsColors: {
          color_s: "rgb(116,160,242)",
          color_o: "rgb(242,121,133)",
        },
        ocsElements: [
          {
            Trait: "ER",
            Description: "Emotional Reactiveness",
          },
          {
            Trait: "E",
            Description: "Extraversion",
          },
          {
            Trait: "O",
            Description: "Openness to Experience",
          },
          {
            Trait: "A",
            Description: "Agreeableness",
          },
          {
            Trait: "C",
            Description: "Conscientiousness",
          },
        ],
        NPS : {
          name: npsName,
          description: npsDescription,
        }
      };
      }else{
          barchartHeadText = {
          SuperTrait: "High_level_competency_scores",
          heading1: "S = Self",
          heading1a: "S",
          heading1b: "= Self",
          heading2: "O = Average All Others",
          heading3: "Competencies",
          heading4: "Top Behaviours",
          heading5: "Underappreciated strengths",
          heading6: "Potential Blind Spots",
          Colors: {
            color_o: "rgb(88, 89, 87)",
            color_s: "rgb(184, 113, 26)",
            color_ps: "rgb(140,233,154)",
            color_p: "rgb(14, 80, 113)",
            color_d: "rgb(164, 99, 216)",
            color_pd: "rgb(14, 80, 113)",
            color_ie: "rgb(64, 164, 217)",
            color_i: "rgb(64, 164, 217)",
            color_e: "rgb(220, 55, 56)",
            color_pdie: "rgb(14, 80, 113)",
          },
          BarColors: [
            "rgb(192,0,0)",
            "rgb(255,217,102)",
            "rgb(169,209,142)",
            "rgb(169,209,142)",
          ],
          TextColors: ["rgb(197,90,17)", "rgb(84,130,53)"],
          Competencies: mergeArrayCompetencies,
          Elements: mergedArrayElements,
          ciiTitle: "Competency_Importance_Index",
          ciiHeading1: "Competency Importance Index",
          ciiHeading2: jsonData[0].selectedCompetencies[0]?.competency_name ?? '',
          ciiHeading3: jsonData[0].selectedCompetencies[1]?.competency_name ?? '',
          ciiHeading4: jsonData[0].selectedCompetencies[2]?.competency_name ?? '',
          ciiHeading5: jsonData[0].selectedCompetencies[3]?.competency_name ?? '',
          ciiHeading6: jsonData[0].selectedCompetencies[4]?.competency_name ?? '',
          ciiHeading7: jsonData[0].selectedCompetencies[5]?.competency_name ?? '',
          ciiColorSelf: "black",
          ciiColorOthers: "rgb(227, 61, 72)",
          ciiElements: [
            {
              Trait: "CII6",
              Description: "S",
            },
            {
              Trait: "CII5",
              Description: "O",
            },
          ],
          ciiCompetencies: ciiArr,
          ocsTitle: "Organizational Climate Snapshot",
          ocsLabel2: "Emotional Reactivity",
          ocsLabel3: "Extraversion",
          ocsLabel4: "Openness to Change",
          ocsLabel5: "Agreeableness",
          ocsLabel6: "Conscientiousness",
          ocsSuperTrait: "Organizational_climate_breakdown",
          ocsColors: {
            color_s: "rgb(116,160,242)",
            color_o: "rgb(242,121,133)",
          },
          ocsElements: [
            {
              Trait: "ER",
              Description: "Emotional Reactiveness",
            },
            {
              Trait: "E",
              Description: "Extraversion",
            },
            {
              Trait: "O",
              Description: "Openness to Experience",
            },
            {
              Trait: "A",
              Description: "Agreeableness",
            },
            {
              Trait: "C",
              Description: "Conscientiousness",
            },
          ],
          NPS : {
            name: npsName,
            description: npsDescription,
          }
        };
      }


      this.jsonSetupSection2 = [
        {
          QuestionNumber: 2,
          Type: "Section",
          Template: "Section",
          Text: "Report Summary",
          id: "High-level-competency-scores",
          name: "Report Summary",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: "section2Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>This section provides a high-level view of your performance on each competency as perceived by your respondents. Your results are broken out by each respondent group for comparison of their perceptions.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section2Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "High-level-competency-scores",
              subElement: "Section2CII",
              subElementName: "showCII",
              Type: "Bar Chart",
              QuestionNumber: "",
              Text: JSON.stringify([barchartHeadText]) || '',
              Template: "Bar-Chart-New-360-Head",
              isChecked: false,
            },
            {
              id: "High-level-competency-scores",
              subElement: "Section2OCS",
              subElementName: "showOCS",
              Type: "Bar Chart",
              QuestionNumber: "",
              Text: JSON.stringify([barchartHeadText]) || '',
              Template: "Bar-Chart-New-360-Head",
              isChecked: false,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section2NPS",
              subElementName: "showNPS",
              Type: "",
              QuestionNumber: "",
              Text: '',
              Template: "Net-Promoter-Score",
              isChecked: false,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },  

    jsonSection3To8(jsonData) {
      let barchartSubText = jsonData[0].selectedCompetencies.map(
        ({ behaviors, competency_code, competency_name }, index) => ({
          SuperTrait: competency_code + "_" + index,
          heading1: "My overall score",
          heading2: "Cohort mean score",
          heading3: "My ratings distribution",
          Colors: {
            color_o: "rgb(88, 89, 87)",
            color_s: "rgb(184, 113, 26)",
            color_ps: "rgb(140,233,154)",
            color_p: "rgb(14, 80, 113)",
            color_d: "rgb(164, 99, 216)",
            color_pd: "rgb(14, 80, 113)",
            color_ie: "rgb(64, 164, 217)",
            color_i: "rgb(64, 164, 217)",
            color_e: "rgb(220, 55, 56)",
            color_pdie: "rgb(14, 80, 113)",
            BarColors: [
              "rgb(192,0,0)",
              "rgb(255,217,102)",
              "rgb(169,209,142)",
              "rgb(169,209,142)",
            ],
            TextColors: ["rgb(197,90,17)", "rgb(84,130,53)"],
          },
          Elements: [ 
            { Trait: competency_code, Description: competency_name },
            ...behaviors.map(({ behavior_code: Trait, behavior_desc: Description }) => ({
              Trait,
              Description,
              Color: "8CE99A",
              Color1: "91A7FF",
              Color2: "66D9E8",
              Color3: "E599F7",
            })),
          ]
        })
      );

      this.jsonSetupSection3To8 = jsonData[0].selectedCompetencies.map(
        ({ competency_code, competency_name, competency_desc }, index) => ({
          QuestionNumber: index + 3,
          Type: "Section",
          Template: "Section",
          Text: competency_name,
          id: competency_name,
          name: competency_name,
          competency_code: competency_code,
          competency_name: competency_name,
          competency_desc: competency_desc,
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: `${competency_name} + ${competency_code}`,
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: '<p>This section indicates your perceived performance on each competency in more detail. Respondents were asked to assess your skills on a 5-point effectiveness scale where 1 represented least and 5 represented most effective.<br />"My ratings distribution" is the number of responses received for each value that was used to calculate the competency averages. It also explains the range of scores given.</p>',
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: `${competency_name} + ${competency_code}`,
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section note static message",
              Type: "Description",
              QuestionNumber: "",
              Text: `<p><strong>${competency_name}</strong><br /><em>${competency_desc}</em></p>`,
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Competencies",
              subElement: "No-Chart",
              name: `${competency_name} Bar`,
              Type: "Bar Chart",
              QuestionNumber: "",
              Text: JSON.stringify([barchartSubText[index]]) || '',
              Template: "Bar-Chart-New-360-Sub",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        })
      );

    },

    jsonHistogram(mergedArrayElementsHistogram) {
      let histogramText = {
        heading1: "Histogram",
        Elements: mergedArrayElementsHistogram,
      };

      this.jsonSetupHistogram = [
        {
          name: "Histogram",
          id: "Histogram",
          Type: "",
          QuestionNumber: "",
          Text: "",
          Template: "",
          isChecked: true,
          subElements: [
            {
              id: "Add-Histogram",
              name: "Histogram",
              Type: "Histogram",
              QuestionNumber: "",
              Text: JSON.stringify([histogramText]) || '',
              Template: "Add-Histogram",
              // Template: "Without-Histogram",
              isChecked: true,
            },
          ],
        },
      ];
    },  
    jsonOCS() {
      let radarChartOCSText = (person) => ({
        Title: person,
        label1: "Self",
        label2: "Primary supervisors",
        label3: "Peers",
        label4: "Direct reports",
        label5: "Internal stakeholders",
        label6: "External stakeholders",
        label7: "Peers/Direct reports",
        label8: "Internal stakeholders/External stakeholders",
        label9:
          "Peers/Direct reports/Internal stakeholders/External stakeholders",
        SuperTrait: "Organizational_climate_breakdown",
        Elements: [
          {
            Trait: "ERX",
            Description: "Emotional Reactiveness",
          },
          {
            Trait: "EX",
            Description: "Extraversion",
          },
          {
            Trait: "OX",
            Description: "Openness to Experience",
          },
          {
            Trait: "AX",
            Description: "Agreeableness",
          },
          {
            Trait: "CX",
            Description: "Conscientiousness",
          },
        ],
      });

      this.jsonSetupOCS = [
        {
          QuestionNumber: "9",
          name: "Organizational Climate Assessment",
          id: "Organizational-Climate-Assessment",
          Type: "Section",
          Text: "Organizational Climate Assessment",
          Template: "Section",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: "section9Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>Organizational climate describes the context in which you work. Organizational climate also provides some indication of the external forces that may help or hinder the way others receive and perceive you. In short, it can impact you and affect your impact on others.</p><p>This section contains statements describing potential characteristics of your organization's culture. It breaks down your respondents' views of key characteristics of your working environment.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p><strong>Organizational Climate Assessment</strong><br /><em>This section contains statements describing potential characteristics of the organization's culture (the environment in which the person works). Please</em><br /><em>select the response that describes the extent to which each statement reflects the actual characteristics of the person's work environment.</em></p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section9Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "Radar-Chart-Self",
              name: "Radar Chart 360 Self",
              Type: "Radar Chart 360",
              QuestionNumber: "",
              Text: JSON.stringify([radarChartOCSText("Self")]) || '',
              Template: "Radar-Chart-360-Self",
              isChecked: true,
            },
            {
              id: "Radar-Chart-Cohort",
              name: "Radar Chart 360 Cohort",
              Type: "Radar Chart 360",
              QuestionNumber: "",
              Text: JSON.stringify([radarChartOCSText("Cohort")]) || '',
              Template: "Radar-Chart-360-Cohort",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },
    jsonCII(jsonData) {
      const index = jsonData.findIndex( (cii) => cii.id === "CompetencyRanking" );

      const ciiArr = []
      const maxIndex = jsonData[0].selectedCompetencies.length; // Get the maximum length
      for (let index = 0; index < maxIndex; index++) {
        const newEntry = {
          Trait: `CII${index + 1}`,
        };
        ciiArr.push(newEntry);
      }

      let ciiTrait = ciiArr.map(item => item.Trait);
      console.log(ciiTrait)

      let ciiText = {
        SuperTrait: "Competency_Importance_Index",
        heading1: "Competency",
        heading2: "Primary supervisors",
        heading3: "Peers",
        heading4: "Direct Report",
        heading5: "Peers/Direct Report",
        heading6: "Internal stakeholders",
        heading7: "External stakeholders",
        heading8: "Internal/External stakeholders",
        heading9:
          "Peers/Direct reports/Internal stakeholders/External stakeholders",
        heading10: "My Respondent's Ranking",
        heading11: "Self",
        heading12: "Cohort ranking",
        Elements: jsonData[index].questions.map((cii,index) => ({
          Trait: ciiTrait[index],
          Description:
            "<strong>" +
            cii.competency_name +
            "</strong> - " +
            cii.competency_desc,
        })),
      };
    
      this.jsonSetupCII = [
        {
          QuestionNumber: "10",
          name: "Competency Importance Index",
          id: "Competency Importance Index",
          Type: "Section",
          Text: "Competency Importance Index",
          Template: "Section",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: "section10Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>Competencies are a great way to provide a clear direction of how a person should perform in their role. Yet, there is no guarantee that everyone in the organization knows or considers the core competencies equally important. In order to manage diverse expectations, it is important to understand which competencies are most important to each constituent group and how much colleagues expectations are aligned.</p><p>\"My Ranking\" shows the average of the order of importance of all of your groups combined. Ties are denoted by an equals sign, and the next position is then skipped. For example, if two competencies are equally ranked as 1st, the two tied competencies will both show =1st, and the next highest competency will be listed as 3rd. The cohort ranking is also provided to give you a sense of how your respondents' views compare with those of your cohort's respondents.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section10Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "Competency-Importance-Index",
              name: "Competency-Importance-Index ",
              Type: "Table 360",
              QuestionNumber: "",
              Text: JSON.stringify([ciiText]) || '',
              Template: "Table-360-Competency",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },  
    jsonHighestLowest(mergedArrayElementsHighestLowest) {
      let highestLowestText;
      if(this.userData.org_id === 427){
          highestLowestText = (superTrait) => ({
          SuperTrait: superTrait,
          heading1: "Item",
          heading2: "Average All Others",
          heading3: "Self",
          heading4: "Total All Cohort Respondents",
          heading5: "All Cohort Self",
          Elements: mergedArrayElementsHighestLowest,
        });
      }else{
          highestLowestText = (superTrait) => ({
          SuperTrait: superTrait,
          heading1: "Item",
          heading2: "My Respondents' Rating",
          heading3: "Self",
          heading4: "Total All Cohort Respondents",
          heading5: "All Cohort Self",
          Elements: mergedArrayElementsHighestLowest,
        });
      }


      this.jsonSetupHighestLowest = [
        {
          QuestionNumber: "11",
          name: "Highest and lowest rated items",
          id: "Highest and lowest rated items",
          Type: "Section",
          Text: "Highest and lowest rated items",
          Template: "Section",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: "section11Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential.&nbsp;Being viewed by:&nbsp;&output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section11Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p><strong>Highest-rated items</strong></p><p>The following items are your <strong>top 5</strong> rated skills. This subset indicates the skills your respondents feel you demonstrate most. It is important to keep in mind that expectations vary and can be affected by context.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Bar-Chart-360-Highest",
              name: "Table 360 Highest",
              Type: "Table 360 Highest",
              QuestionNumber: "",
              Text: JSON.stringify([highestLowestText("Highest")]) || '',
              Template: "Bar-Chart-360-Highest",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p><strong>Lowest-rated items</strong></p><p>The following items are your <strong>bottom 5</strong> rated skills. This subset indicates the skills your respondents feel you demonstrate least. It is important to keep in mind that expectations vary and can be affected by context.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Bar-Chart-360-Lowest",
              name: "Table 360 Lowest",
              Type: "Table 360 Lowest",
              QuestionNumber: "",
              Text: JSON.stringify([highestLowestText("Lowest")]) || '',
              Template: "Bar-Chart-360-Lowest",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },  
    jsonBlindSpot(mergedArrayElementsBlindSpot) {
      let blindSpotText;

      if(this.userData.org_id === 427){
          blindSpotText = {
          SuperTrait: "Blind_spots",
          heading1: "Item",
          heading2: "Average All Others",
          heading3: "Self",
          heading4: "Difference",
          Elements: mergedArrayElementsBlindSpot,
        };
      }else{
        blindSpotText = {
          SuperTrait: "Blind_spots",
          heading1: "Item",
          heading2: "Others",
          heading3: "Self",
          heading4: "Difference",
          Elements: mergedArrayElementsBlindSpot,
        };
      }

      let changeBlindSpotNameBaseOnOrgId;
      let changeBlindSpotOverEstimatedDescription;
      let changeBlindSpotUnderEstimatedDescription;

      if(this.userData.org_id === 427){

          changeBlindSpotNameBaseOnOrgId = "Watchouts"
          changeBlindSpotUnderEstimatedDescription = "Undiscovered Strengths"
          changeBlindSpotOverEstimatedDescription = "Watchouts"

          this.jsonSetupBlindSpot = [
            {
              QuestionNumber: "12",
              name: changeBlindSpotNameBaseOnOrgId,
              id: "Blind Spots",
              Type: "Section",
              Text: changeBlindSpotNameBaseOnOrgId,
              Template: "Section",
              isChecked: true,
              subElements: [
                {
                  id: "ImportantTemplate",
                  subId: "section12Input",
                  subElement: "Confidential dynamic message.",
                  Type: "Heading",
                  QuestionNumber: "",
                  Text: "<p><strong>Confidential.&nbsp;Being viewed by:&nbsp;&output_name</strong></p>",
                  Template: "Heading-text-nobox",
                  isChecked: true,
                },
                {
                  id: "ImportantTemplate",
                  subId: "section12Input",
                  subElement: "ImportantNote",
                  Type: "Dynamic Message",
                  QuestionNumber: "",
                  Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
                  Template: "text-important-note",
                  isChecked: true,
                },
                {
                  id: "ImportantTemplate",
                  subElement:
                    "Description static message",
                  Type: "Description",
                  QuestionNumber: "",
                  Text: "<p>Differences between our own views and the views of others can reflect over- or under-confidence and create blind spots. This potential lack of self-awareness can cause relationships to suffer due to an inability to see how others receive and perceive us. If you can master your blind spots, you can take your leadership skills to the next level. Skills which represent a difference of 1.5 or more between your self-rated score and the average score received from your respondents appear here.</p>",
                  Template: "Description-text-nobox",
                  isChecked: true,
                },
                {
                  id: "ImportantTemplate",
                  subElement:
                    "Description static message",
                  Type: "Description",
                  QuestionNumber: "",
                  Text: `<p><strong>${changeBlindSpotUnderEstimatedDescription}</strong></p><p><span style='font-weight: 400;'>These are also called&nbsp;</span><em><span style='font-weight: 400;'>Underestimated Skills</span></em><span style='font-weight: 400;'>. They are areas where you view yourself as significantly&nbsp;</span><em><span style='font-weight: 400;'>less&nbsp;</span></em><span style='font-weight: 400;'>effective than your respondents do. These skills represent opportunities to amplify or expand your positive impact on others.</span></p>`,
                  Template: "Description-text-nobox",
                  isChecked: true,
                },
                { 
                  id: "Blind-Spot-Underestimated",
                  name: "Blind Spots Underestimated",
                  Type: "Blind Spots Underestimated",
                  QuestionNumber: "",
                  Text: JSON.stringify([blindSpotText]) || '',
                  Template: "Table-360-Underestimated",
                  isChecked: true,
                },
                {
                  id: "ImportantTemplate",
                  subElement:"Description static message",
                  Type: "Description",
                  QuestionNumber: "",
                  Text: `<p><br /><strong>${changeBlindSpotOverEstimatedDescription}</strong></p><p>Areas where I view myself as significantly <strong>more</strong> effective than my colleagues do. These skills represent opportunities to improve my leadership impact on others.</p>`,
                  Template: "Description-text-nobox",
                  isChecked: true,
                },
                {
                  id: "Blind-Spot-Overestimated",
                  name: "Blind Spots Overestimated",
                  Type: "Blind Spots Overestimated",
                  QuestionNumber: "",
                  Text: JSON.stringify([blindSpotText]) || '',
                  Template: "Table-360-Overestimated",
                  isChecked: true,
                },
                {
                  id: "ImportantTemplate",
                  subElement: "Section-End",
                  Type: "Section-End",
                  QuestionNumber: "",
                  Text: "",
                  Template: "Section-End",
                  isChecked: true,
                },
              ],
            },
          ];
      }else{
          changeBlindSpotNameBaseOnOrgId = "Blind Spots"
          changeBlindSpotUnderEstimatedDescription = "Underappreciated Strengths"
          changeBlindSpotOverEstimatedDescription = "Potential Blind Spots"

          this.jsonSetupBlindSpot = [
          {
            QuestionNumber: "12",
            name: changeBlindSpotNameBaseOnOrgId,
            id: "Blind Spots",
            Type: "Section",
            Text: changeBlindSpotNameBaseOnOrgId,
            Template: "Section",
            isChecked: true,
            subElements: [
              {
                id: "ImportantTemplate",
                subId: "section12Input",
                subElement: "Confidential dynamic message.",
                Type: "Heading",
                QuestionNumber: "",
                Text: "<p><strong>Confidential.&nbsp;Being viewed by:&nbsp;&output_name</strong></p>",
                Template: "Heading-text-nobox",
                isChecked: true,
              },
              {
                id: "ImportantTemplate",
                subElement:
                  "Description static message",
                Type: "Description",
                QuestionNumber: "",
                Text: `<p>Differences between our own views and the views of others can reflect over- or under-confidence and create blind spots. This potential lack of self-awareness can cause relationships to suffer due to an inability to see how others receive and perceive us. If you can master your blind spots, you can take your leadership skills to the next level. Skills which represent a difference of 1.5 or more between your self-rated score and the average score received from your respondents appear here.</p><p><br /><strong>${changeBlindSpotOverEstimatedDescription}</strong></p><p>Areas where I view myself as significantly <strong>more</strong> effective than my colleagues do. These skills represent opportunities to improve my leadership impact on others.</p>`,
                Template: "Description-text-nobox",
                isChecked: true,
              },
              {
                id: "ImportantTemplate",
                subId: "section12Input",
                subElement: "ImportantNote",
                Type: "Dynamic Message",
                QuestionNumber: "",
                Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
                Template: "text-important-note",
                isChecked: true,
              },
              {
                id: "Blind-Spot-Overestimated",
                name: "Blind Spots Overestimated",
                Type: "Blind Spots Overestimated",
                QuestionNumber: "",
                Text: JSON.stringify([blindSpotText]) || '',
                Template: "Table-360-Overestimated",
                isChecked: true,
              },
              {
                id: "ImportantTemplate",
                subElement:
                  "Description static message",
                Type: "Description",
                QuestionNumber: "",
                Text: `<p><strong>${changeBlindSpotUnderEstimatedDescription}</strong></p><p><span style='font-weight: 400;'>These are also called&nbsp;</span><em><span style='font-weight: 400;'>Underestimated Skills</span></em><span style='font-weight: 400;'>. They are areas where you view yourself as significantly&nbsp;</span><em><span style='font-weight: 400;'>less&nbsp;</span></em><span style='font-weight: 400;'>effective than your respondents do. These skills represent opportunities to amplify or expand your positive impact on others.</span></p>`,
                Template: "Description-text-nobox",
                isChecked: true,
              },
              {
                id: "Blind-Spot-Underestimated",
                name: "Blind Spots Underestimated",
                Type: "Blind Spots Underestimated",
                QuestionNumber: "",
                Text: JSON.stringify([blindSpotText]) || '',
                Template: "Table-360-Underestimated",
                isChecked: true,
              },
              {
                id: "ImportantTemplate",
                subElement: "Section-End",
                Type: "Section-End",
                QuestionNumber: "",
                Text: "",
                Template: "Section-End",
                isChecked: true,
              },
            ],
          },
        ];
      }

    },
    jsonOEQ(jsonData) {
      const index = jsonData.findIndex((oeq) => oeq.id === "OpenEndedQuestions");
      const filteredOEQData = jsonData[index].questions.filter((oeq) => oeq.isChecked === true);

      let oeqText = {
        SuperTrait: "Written_comments",
        Elements: filteredOEQData.map((oeq, index2) => ({
          Trait: "OEQ" + (index2 + 1),
          Description: oeq.question,
        })),
      };

      this.jsonSetupOEQ = [
        {
          QuestionNumber: "13",
          name: "Open Ended Responses",
          id: "Open Ended Responses",
          Type: "Section",
          Text: "Open Ended Responses",
          Template: "Section",
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: "section13Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential.&nbsp;Being viewed by:&nbsp;&output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>This section contains free-text responses to open-ended questions from each respondent regarding their experiences of you. Your Primary Supervisor's comments are listed in <strong>bold</strong>. All other responses are ordered randomly to ensure confidentiality for individual respondents.</p><p><strong>Open-ended Questions</strong></p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section13Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "Open-Ended-Questions",
              name: "Open Ended Questions",
              Type: "Open Ended Questions",
              QuestionNumber: "",
              Text: JSON.stringify([oeqText]) || '',
              Template: "Table-360-Open-ended",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },
    jsonSectionAppendix() {
      this.jsonSetupAppendix = [
        {
          QuestionNumber: "14",
          Type: "Section",
          name: "Appendix I: Understanding the data",
          id: "Appendix I: Understanding the data",
          Text: "Appendix I: Understanding the data",
          Template: "Section",
          isChecked: true,
          subElements: [
            {
              id: "Appendix",
              subId: "section14Input",
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential.&nbsp;Being viewed by:&nbsp;&output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: "section14Input",
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "Appendix",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: "<p>This report presents your results as average scores received from your various respondents. All data is grouped by respondent type to illustrate patterns and actions that can vary by their relationship to you. It is important to take a moment to understand how the data is calculated and what it represents.</p><p><strong>Averages</strong></p><p>All 'total' and 'overall' scores in this report are based on the average of the scores from each respondent group, not each respondent. For example, a rating from 1 manager carries the same weight as ratings from 10 direct reports. While there are other ways to calculate average scores, this method was chosen to reflect management processes observed in typical organizational hierarchies.</p><p>Respondents were asked to assess your skills on a 5-point effectiveness scale where 1 represented least and 5 represented most effective.</p><p>The number of respondents is found in parentheses after each respondent group and indicates how many respondents answered each item. The number of respondents may differ from one item to the next because some may have declined to score some items.</p>",
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Appendix",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        },
      ];
    },


jsonSectionNPS(jsonData) {
      let barchartSubText = jsonData[4].questions.map(
        ({ nps_code, nps_name }, index) => ({
          SuperTrait: nps_code + "_" + index,
          heading1: "Net Promoter score",
          heading2: "Cohort Net Promoter score",
          heading3: "My ratings distribution",
          Colors: {
            color_o: "rgb(88, 89, 87)",
            color_s: "rgb(184, 113, 26)",
            color_ps: "rgb(140,233,154)",
            color_p: "rgb(14, 80, 113)",
            color_d: "rgb(164, 99, 216)",
            color_pd: "rgb(14, 80, 113)",
            color_ie: "rgb(64, 164, 217)",
            color_i: "rgb(64, 164, 217)",
            color_e: "rgb(220, 55, 56)",
            color_pdie: "rgb(14, 80, 113)",
            BarColors: [
              "rgb(192,0,0)",
              "rgb(255,217,102)",
              "rgb(169,209,142)",
              "rgb(169,209,142)",
            ],
            TextColors: ["rgb(197,90,17)", "rgb(84,130,53)"],
          },
          Elements:
            { 
              Trait: nps_code, Description: nps_name,
              Color: "8CE99A",
              Color1: "91A7FF",
              Color2: "66D9E8",
              Color3: "E599F7" 
            },
        })
      );

      this.jsonSetupSectionNPS = jsonData[4].questions.map(
        ({ nps_code, nps_name, nps_description }, index) => ({
          QuestionNumber: index + 3,
          Type: "Section",
          Template: "Section",
          Text: nps_name,
          id: nps_name,
          name: nps_name,
          nps_code: nps_code,
          nps_name: nps_name,
          nps_description: nps_description,
          isChecked: true,
          subElements: [
            {
              id: "ImportantTemplate",
              subId: `${nps_name} + ${nps_code}`,
              subElement: "Confidential dynamic message.",
              Type: "Heading",
              QuestionNumber: "",
              Text: "<p><strong>Confidential. Being viewed by: &output_name</strong></p>",
              Template: "Heading-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Description static message",
              Type: "Description",
              QuestionNumber: "",
              Text: '<p>This section indicates your perceived performance on each nps in more detail. Respondents were asked to assess your skills on a 5-point effectiveness scale where 1 represented least and 5 represented most effective.<br />"My ratings distribution" is the number of responses received for each value that was used to calculate the nps averages. It also explains the range of scores given.</p>',
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subId: `${nps_name} + ${nps_code}`,
              subElement: "ImportantNote",
              Type: "Dynamic Message",
              QuestionNumber: "",
              Text: "<p><strong>Important note: Some of your responses have been moved into a combined group, to protect confidentiality.</strong></p>",
              Template: "text-important-note",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section note static message",
              Type: "Description",
              QuestionNumber: "",
              Text: `<p><strong>${nps_name}</strong><br /><em>${nps_description}</em></p>`,
              Template: "Description-text-nobox",
              isChecked: true,
            },
            {
              id: "Net-Promoter-Score",
              subElement: "No-Chart",
              name: `${nps_name} Bar`,
              Type: "Bar Chart",
              QuestionNumber: "",
              Text: JSON.stringify([barchartSubText[index]]) || '',
              Template: "Bar-Chart-New-360-Sub-NPS",
              isChecked: true,
            },
            {
              id: "ImportantTemplate",
              subElement: "Section-End",
              Type: "Section-End",
              QuestionNumber: "",
              Text: "",
              Template: "Section-End",
              isChecked: true,
            },
          ],
        })
      );

    },

    handleFileUpload(event) {
      this.surveyFileName = event.target.files[0].name

      // Check if the file extension is .srv
      if (this.surveyFileName.toLowerCase().endsWith('.srv')) {
        const surveyName = this.surveyFileName.replace(/\.[^/.]+$/, '');
        this.originalSurveyName = surveyName
        this.isFileSRV = true

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const fileContent = reader.result;
          this.processFileContent(fileContent);
        };

        reader.readAsText(file);
      } 
      else {
        this.surveyFileName = 'Click here... \n Select a new report using a survey(.srv) file.'
        this.isFileSRV = false
        Swal.fire({
          text: 'Please upload only .srv file',
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        })
      }
    },

    handleFileUploadRpt(event) {
      this.reportFileName = event.target.files[0].name

      // Check if the file extension is .rpt
      if (this.reportFileName.toLowerCase().endsWith('.rpt')) {
        const reportName = this.reportFileName.replace(/\.[^/.]+$/, '');
        this.originalReportName = reportName

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
          const fileContent = reader.result;
          const parsedFileContent = JSON.parse(fileContent);
          this.list = parsedFileContent;
          this.onClickButton(this.list);
        };

        reader.readAsText(file);
      }
      else {
        this.reportFileName = 'Click here... \n Edit a report using a report(.rpt) file.'
        Swal.fire({
          text: 'Please upload only .rpt file',
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        })
      }
      
    },

    processFileContent(content) {
      try {
        const jsonData = JSON.parse(content);
        console.log(jsonData);

        this.jsonSectionHeader()
        this.jsonSection1()
        this.jsonSectionAppendix()

        const competencies = jsonData.find((cii) => cii.id === "Competencies");
        if(competencies) {
          let barchartHeadElements = jsonData[0].selectedCompetencies.map(
            ({ competency_code, competency_name, behaviors }) => ({
              Competencies: [
                {
                  Acronym: competency_code,
                  Name: competency_name,
                },
              ],
              Elements: behaviors.map((behavior) => ({
                Trait: behavior.behavior_code,
                Competency: competency_name,
                Behaviour: behavior.behavior_desc,
              })),
              ElementsHistogram: [ 
                { Trait: competency_code },
                ...behaviors.map(({ behavior_code: Trait }) => ({
                  Trait
                })),
              ],
              ElementsHighestLowest: behaviors.map((behavior) => ({
                Trait: behavior.behavior_code,
                TraitBold: "<b>(" + competency_name + ")</b>",
                Description: behavior.behavior_desc,
                Color: "8CE99A",
                Color1: "91A7FF",
                Color2: "66D9E8",
                Color3: "E599F7",
              })),
              ElementsBlindSpot: behaviors.map((behavior) => ({
                Trait: behavior.behavior_code,
                Description:
                  "<b>(" + competency_name + ")</b> " + behavior.behavior_desc,
                Color: "8CE99A",
                Color1: "91A7FF",
                Color2: "66D9E8",
                Color3: "E599F7",
              })),
            })
          );
          
          let mergedArrayElements = [];
          let mergedArrayElementsHistogram = [];
          let mergedArrayElementsHighestLowest = [];
          let mergedArrayElementsBlindSpot = [];
          let mergeArrayCompetencies = [];

          for (let barchartHead of barchartHeadElements) {
            mergedArrayElements = mergedArrayElements.concat(
              barchartHead.Elements
            );
            mergedArrayElementsHistogram = mergedArrayElementsHistogram.concat(
              barchartHead.ElementsHistogram
            );
            mergedArrayElementsHighestLowest =
              mergedArrayElementsHighestLowest.concat(
                barchartHead.ElementsHighestLowest
              );
            mergedArrayElementsBlindSpot = mergedArrayElementsBlindSpot.concat(
              barchartHead.ElementsBlindSpot
            );
            mergeArrayCompetencies = mergeArrayCompetencies.concat(
              barchartHead.Competencies
            );
          }

          // section 2
          this.jsonSection2(mergeArrayCompetencies, mergedArrayElements, jsonData)
          // section 3-8
          this.jsonSection3To8(jsonData)
          // histogram
          this.jsonHistogram(mergedArrayElementsHistogram)
          // Highest Lowest Rated Items
          this.jsonHighestLowest(mergedArrayElementsHighestLowest)
          // Blind Spot
          this.jsonBlindSpot(mergedArrayElementsBlindSpot)
          //Mix Net Promoter Score Choices
          this.jsonSectionNPS(jsonData)

        }

        const organizationalClimate = jsonData.find( (ocs) => ocs.id === "OrganizationalClimate");
        if(organizationalClimate) {
          this.jsonOCS()
        }

        const competencyRanking = jsonData.find((cii) => cii.id === "CompetencyRanking");
        if(competencyRanking) {
          this.jsonCII(jsonData)
        }

        const openEndedQuestions = jsonData.find( (oeq) => oeq.id === "OpenEndedQuestions");
        if(openEndedQuestions) {
          this.jsonOEQ(jsonData)
        }

        //merge all sections from 1-14
        const jsonSetupAllSections = [
          ...this.jsonSetupHeader,
          ...this.jsonSetupSection1,
          ...this.jsonSetupSection2,
          ...this.jsonSetupSection3To8,
          ...this.jsonSetupHistogram,
          ...this.jsonSetupOCS,
          ...this.jsonSetupCII,
          ...this.jsonSetupHighestLowest,
          ...this.jsonSetupBlindSpot,
          ...this.jsonSetupOEQ,
          ...this.jsonSetupAppendix,
          ...this.jsonSetupSectionNPS,
        ];

        this.list = jsonSetupAllSections;
        console.log("this.list")
        console.log(this.list)
        this.onClickButton(this.list);
      }
      catch(error) {
        console.error("Error parsing JSON file:", error);
      }
    },




    
  },
};
</script>


<style scoped>
.body-container {
  padding: 20px 20px 20px 20px;
  box-shadow: none;
}
.container {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
p {
  font-size: 100%;
  align-items: center;
}

#upload-file {
   opacity: 0;
   position: absolute;
   z-index: -1;
}

#upload-file-rpt {
   opacity: 0;
   position: absolute;
   z-index: -1;
}

.input-file-label{
  border: 1px solid #ccc;
  background: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  min-height: 100px;
  border-radius: 3px;
  max-width: 60%;
  text-align: center;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>