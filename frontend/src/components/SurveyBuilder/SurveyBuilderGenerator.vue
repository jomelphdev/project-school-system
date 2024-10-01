<template>
  <div></div>
</template>
<script>
export default {
  data() { 
    return {
      
    }
  },
  methods: {
    generateHtml(surveyData, filename) { 
      let input = JSON.parse(surveyData)
      let ids = []

      let output = `
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title></title>
              <style>
                  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&display=swap');
                  .main-container{
                    display: flex;
                    justify-content: center;
                    margin: 20px 100px;
                    font-size: 14px;
                    font-family: 'Open Sans', sans-serif;
                  }
                  .sub-container{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                  }
                  .card-box{
                    border-top: 4px solid rgb(0, 67, 94);
                    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
                    margin-bottom: 30px;
                    padding: 10px 20px;
                  }
                  .question-box{
                    border-top: 4px solid rgb(0, 67, 94);
                    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
                    margin-bottom: 30px;
                    padding: 10px 20px;
                  }
                  .reorder-box{
                    border-top: 4px solid rgb(0, 67, 94);
                    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
                    margin-bottom: 30px;
                    padding: 10px 20px;
                  }
                  .reorder-box:nth-of-type(54), 
                  .reorder-box:nth-of-type(55),
                  .reorder-box:nth-of-type(56),
                  .reorder-box:nth-of-type(57),
                  .reorder-box:nth-of-type(58) {
                    display: none;
                  }
                  .question-field {
                    font-weight: bold;
                  }
                  .free-text-question {
                    font-weight: bold;
                  }
                  .demographic-quesiton {
                    font-weight: bold;
                  }
                  .sharing-option{
                    font-weight: bold;
                    margin-bottom: 16px
                  }
                  .sharing-option p {
                    display:inline;
                  }
                  .button-section {
                    display: flex;
                    justify-content: space-around;
                    text-align: center;
                  }
                  .form-select, .form-control {
                    box-shadow: none !important;
                  }
                  .btn.btn-outline-secondary {
                    font-size: 14px;
                    font-weight: 600;
                    border: 2px solid #999;
                    border-radius: 10px;
                    box-shadow: none !important;
                  }
                  .btn.btn-outline-secondary:hover {
                    color: rgb(25, 25, 25);
                    background-color: rgb(210, 210, 210);
                  }
                  .btn-check:checked + .btn-outline-secondary {
                    color: rgb(25, 25, 25);
                    background-color: rgb(168, 168, 168);
                  }
                  @media (max-width: 875px) {
                    .button-section {
                      display: flex;
                      flex-direction: column;
                      text-align: center;
                    }
                    .btn.btn-outline-secondary{
                      width: 100%;
                    }
                  }
                  .reOrder-mainContainer {
                    background-color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin: 0;
                  }
                  .item {
                    border: 1px solid #ddd;
                    color: #34444f;
                    cursor: pointer;
                    position: relative;
                    user-select: none;
                    padding: 10px;
                    background-color: #0036e711;
                    touch-action: none;
                  }
                  .item.onDrag {
                    opacity: 1;
                    background-color: #f5f5f5;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                    background: transparent;
                    color: transparent;
                    border: 1px solid #4ca1af;
                  }
                  .item:last-child {
                    display: hidden;
                    line-height: 0;
                    height: 0;
                    overflow: hidden;
                    touch-action: none;
                    -webkit-touch-callout: none; /* iOS Safari */
                    -webkit-user-select: none; /* Safari */
                    -khtml-user-select: none; /* Konqueror HTML */
                    -moz-user-select: none; /* Old versions of Firefox */
                    -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none;
                    background-color: white;
                    border: none;
                  }
                  .item:last-child::before {
                    border:none;
                    height:0;
                  }
                  .itemClip {
                    position: absolute;
                    background-color: white;
                    opacity: 1;
                    top: 0;
                    left: 0;
                    transform: translate(-50%, -50%);
                    transition: none;
                    background-color: white;
                  }
                  .hide {
                    display: none;
                  }
                  .textarea {
                    width: 350px;
                    height: 200px;
                    margin-top: 10px;
                    margin-bottom: 20px;
                    display: relative;
                  }
                  .reOrder-subContainer {
                    display: flex;
                    height: auto;
                    padding: 15px;
                    gap: 5px;
                  }
                  .rank-no {
                    border: 1px solid #ddd;
                    text-align: center;
                    color: #333;
                    position: relative;
                    transition: all 0.3s;
                    user-select: none;
                    padding: 10px;
                  }
                  .unfocus {
                    color: #6c757d !important;
                    background-color: #ffff !important;
                    border-color: #999 !important;
                  }
                  .focus {
                    color: #ffff;
                    background-color: #6c757d;
                  }
                  .invalid-question {
                    color: #dc3545;
                  }
                  .valid-question {
                    color: #212529
                  }
                  .input {
                    outline: 0;
                    border-width: 0 0 1px;
                    border-color: grey;
                    padding: 2px 5px;
                    margin: 10px 0px;
                    background: none;
                  }
                  .formBox {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    margin: 1em 0 10px;
                    width: 370px;
                  }
                  .btn-submit {
                    background-color: #e67829 !important;
                    color: #fff !important;
                    appearance: none;
                    border: 1px solid rgba(27, 31, 35, 0.15);
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 6px 16px;
                  }
                  .btn-cancel {
                    background-color: #dbdbdb !important;
                    color: #000 !important;
                    appearance: none;
                    border: 1px solid rgba(27, 31, 35, 0.15);
                    border-radius: 5px;
                    cursor: pointer;
                    padding: 6px 16px;
                  }
                  .net-promoter-likert{
                    display: flex;
                    justify-content: space-between;
                  }
                </style>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet">
              </head>
              <body class="print-page">
                <div class="main-container">
                  <div class="sub-container">
                    <form id="submitSurvey" method="POST">
                  `;
        for (let i = 0; i < input.length; i++) {
          let data = input[i];
          if (data.Template === 'Heading-text') {
            output += `
                
                <div class="heading-text">
                  <h3>` + data.Text + `</h3>
                </div>
          `;
          }
          if (data.Template === 'Description-text') {
            output += `
                
                <div class="card-box">
                  <p id="desc-text">` + data.Text + `</p>
                </div>
          `;
          }
          if (data.Template === 'LMC-Accuracy-5-N') {
            output += this.generateQuestion(data, false);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Accuracy-5-P') {
            output += this.generateQuestion(data, true);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Effectiveness-6') {
            output += this.generateQuestion360Effectiveness(data);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Agreement-6') {
            output += this.generateQuestion360Agreement(data);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Characteristic-5') {
            output += this.generateQuestionVFP(data);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Net-Promoter-Score') {
            output += this.generateQuestionNetPromoter(data);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'LMC-Degree') {
            output += this.generateQuestionDegree(data);
            ids.push(data.QuestionNumber);
          }
          if (data.Template === 'Select_Country') {
            output += `
                
                <div class="question-box">
                  <div class="demographic-quesiton">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  
                  <!-- Country List here from jquery -->
                  <div class="mb-3 country_list"></div>
                </div>
          `
          }
          if (data.Template === 'Select_Gender') {
            output += `
                
                <div class="question-box">
                  <div class="demographic-quesiton">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `" required>
                    <option value="" disabled selected>- Select -</option>
                    <option value="man">Man</option>
                    <option value="woman">Woman</option>
                    <option value="trans">Trans</option>
                    <option value="prefer a different term">Prefer a different term</option>
                    <option value="prefer not to say">Prefer not to say</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'Select_Age') {
            output += `
                
                <div class="question-box">
                  <div class="demographic-quesiton">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `" required>
                    <option value="" disabled selected>- Select -</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                    <option value="60">60</option>
                    <option value="61">61</option>
                    <option value="62">62</option>
                    <option value="63">63</option>
                    <option value="64">64</option>
                    <option value="65">65</option>
                    <option value="66">66</option>
                    <option value="67">67</option>
                    <option value="68">68</option>
                    <option value="69">69</option>
                    <option value="70">70</option>
                    <option value="71">71</option>
                    <option value="72">72</option>
                    <option value="73">73</option>
                    <option value="74">74</option>
                    <option value="75">75</option>
                    <option value="76">76</option>
                    <option value="77">77</option>
                    <option value="78">78</option>
                    <option value="79">79</option>
                    <option value="80">80</option>
                    <option value="81">81</option>
                    <option value="82">82</option>
                    <option value="83">83</option>
                    <option value="84">84</option>
                    <option value="85">85</option>
                    <option value="85">85</option>
                    <option value="86">86</option>
                    <option value="87">87</option>
                    <option value="88">88</option>
                    <option value="89">89</option>
                    <option value="90">90</option>
                    <option value="91">91</option>
                    <option value="92">92</option>
                    <option value="93">93</option>
                    <option value="94">94</option>
                    <option value="95">95</option>
                    <option value="96">96</option>
                    <option value="97">97</option>
                    <option value="98">98</option>
                    <option value="99">99</option>
                    <option value="100">100</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'TagDisplay' && data.Tag === '20') {
            output += `
                
                <div class="question-box" id="coach-access">
                  <div class="sharing-option">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `" required>
                    <option value="" disabled selected>- Select -</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'TagDisplay' && data.Tag === '4') {
            output += `
                
                <div class="question-box" id="coach-group-access">
                  <div class="sharing-option">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `">
                    <option value="" disabled selected>- Select -</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'TagDisplay' && data.Tag === '19') {
            output += `
                
                <div class="question-box" id="hr-access">
                  <div class="sharing-option">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `">
                    <option value="" disabled selected>- Select -</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'Select_YN') {
            output += `
                
                <div class="question-box">
                  <div class="sharing-option">
                  ` + data.QuestionNumber + '. ' + data.Text + `
                  </div>
                  <select class="form-select" name="Q` + data.QuestionNumber + `" required>
                    <option value="" disabled selected>- Select -</option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>
          `
          }
          if (data.Template === 'Free-text') {
            output += `
                
                <div class="question-box">
                  <div class="free-text-question" id="` + data.QuestionNumber + `-question">
                  ` + data.QuestionNumber + '. ' + data.Text + ' (minimum 15 characters)' +`
                  </div>
                  <input class="form-control" minlength="15" maxlength="2000" type="text" name="Q` + data.QuestionNumber + `" required>
                  <small class="form-text text-muted">0 characters remaining</small>
                </div>
          `
          }
          if (data.Template === 'Re-order') {
            output += `
                
                  <div class="reorder-box">
                    <div class="reOrder-mainContainer">
                      <div class="reOrder-subContainer">
                        <div class="rank-col">
                          <div id="rank" class="rank"></div>
                        </div>
                        <div class="item-col">
                          <div id="box" class="box">
                            <div id="itemClip" class="item itemClip hide">some item</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          `
          ids.push(data.QuestionNumber);
          }
          
        }
        // show submit button
        for (let i = 0; i < input.length; i++) {
                let data = input[i];
      
          if (
            data.Template === 'LMC-Effectiveness-6' ||
            data.Template === 'LMC-Accuracy-5-P' ||
            data.Template === 'LMC-Agreement-6' ||
            data.Template === 'Select_YN' ||
            data.Template === 'LMC-Characteristic-5' ||
            data.Template === 'LMC-Net-Promoter-Score' ||
            data.Template === 'LMC-Degree'
          ) { 
                  output += `
                    <button type="submit" class="btn btn-secondary" id="submit_btn">Submit</button>
                  `
                  break
                }
              }
      output += `
                </form>
              </div>
            </div>
            <scriptSuffixToRemove src="https://code.jquery.com/jquery-3.6.0.min.js"
              integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></scriptSuffixToRemove>
            <scriptSuffixToRemove src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous">
            </scriptSuffixToRemove>
            <scriptSuffixToRemove src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></scriptSuffixToRemove>
            <scriptSuffixToRemove src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></scriptSuffixToRemove>
            <scriptSuffixToRemove src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.8.2/chart.min.js">
            </scriptSuffixToRemove>
            <scriptSuffixToRemove>` + this.addJS(ids, surveyData) + `</scriptSuffixToRemove>
          </body>
        </html>
      `

      output = output.replaceAll("SuffixToRemove", "");

      // Create a Blob with the HTML content
      const blob = new Blob([output], { type: 'text/html' });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // Set the filename for the downloaded file
      link.click();

      // Clean up the URL object after the file is downloaded
      URL.revokeObjectURL(url);
    }, // end of individual360Funct
    generateQuestion(data, isPositivelyWorded) {
      let output = `
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text + `</p>
          <div class="button-section">` + this.generateOptions(data.QuestionNumber, isPositivelyWorded) + `</div>
        </div>
      `
      return output;
    },
    generateOptions(questionNumber, positive = false) {
      let optionsMap = [{
        letter: positive ? 'a' : 'e',
        value: positive ? 1 : 5,
        label: 'Very Inaccurate'
      }, {
        letter: positive ? 'b' : 'd',
        value: positive ? 2 : 4,
        label: 'Moderately Inaccurate'
      }, {
        letter: 'c',
        value: 3,
        label: 'Neither Accurate Nor Inaccurate'
      }, {
        letter: positive ? 'd' : 'b',
        value: positive ? 4 : 2,
        label: 'Moderately Accurate'
      }, {
        letter: positive ? 'e' : 'a',
        value: positive ? 5 : 1,
        label: 'Very Accurate'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    generateQuestion360Effectiveness(data) {
      let output = `
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text + `</p>
          <div class="button-section">` + this.generateOptions360Effectiveness(data.QuestionNumber) + `</div>
        </div>
      `
      return output;
    },
    generateOptions360Effectiveness(questionNumber) {
      let optionsMap = [{
        letter: 'a',
        value: 1,
        label: 'Very Ineffective'
      }, {
        letter: 'b',
        value: 2,
        label: 'Ineffective'
      }, {
        letter: 'c',
        value: 3,
        label: 'Neither effective nor ineffective'
      }, {
        letter: 'd',
        value: 4,
        label: 'Effective'
      }, {
        letter: 'e',
        value: 5,
        label: 'Very Effective'
      }, {
        letter: 'f',
        value: 0,
        label: 'No Evidence / Don\'t know'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    generateQuestion360Agreement(data) {
      let output = ` 
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text + `</p>
          <div class="button-section">` + this.generateOptions360Agreement(data.QuestionNumber) + `</div>
        </div>
      `
      return output;
    },
    generateOptions360Agreement(questionNumber) {
      let optionsMap = [{
        letter: 'a',
        value: 1,
        label: 'Strongly Disagree'
        
      }, {
        letter: 'b',
        value: 2,
        label: 'Disagree'
        
      }, {
        letter: 'c',
        value: 3,
        label: 'Undecided'
      }, {
        letter: 'd',
        value: 4,
        label: 'Agree'
      }, {
        letter: 'e',
        value: 5,
        label: 'Strongly Agree'
      }, {
        letter: 'f',
        value: 0,
        label: 'No Evidence / Don\'t know'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    generateQuestionVFP(data) {
      let output = ` 
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text + `</p>
          <div class="button-section">` + this.generateOptionsVFP(data.QuestionNumber) + `</div>
        </div>
      `
      return output;
    },
    generateOptionsVFP(questionNumber) {
      let optionsMap = [{
        letter: 'a',
        value: 1,
        label: 'A is highly characteristic'
      }, {
        letter: 'b',
        value: 2,
        label: 'A is somewhat more characteristic'
      }, {
        letter: 'c',
        value: 3,
        label: 'Both are equally characteristic'
      }, {
        letter: 'd',
        value: 4,
        label: 'B is somewhat more characteristic'
      }, {
        letter: 'e',
        value: 5,
        label: 'B is highly characteristic'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    generateQuestionNetPromoter(data) {
      let output = ` 
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text.Question + `</p>
          <div class="net-promoter-likert">
            <p>` + data.Text.LeftText + `</p>
            <p>` + data.Text.RightText + `</p>
          </div>
          <div class="button-section">` + this.generateOptionsNetPromoter(data.QuestionNumber) + `</div>
        </div>
      `
      return output;
    },
    generateOptionsNetPromoter(questionNumber) {
      let optionsMap = [{
        letter: 'a',
        value: 1,
        label: '1'
      }, {
        letter: 'b',
        value: 2,
        label: '2'
      }, {
        letter: 'c',
        value: 3,
        label: '3'
      }, {
        letter: 'd',
        value: 4,
        label: '4'
      }, {
        letter: 'e',
        value: 5,
        label: '5'
      },{
        letter: 'f',
        value: 6,
        label: '6'
      },{
        letter: 'g',
        value: 7,
        label: '7'
      },{
        letter: 'h',
        value: 8,
        label: '8'
      },{
        letter: 'i',
        value: 9,
        label: '9'
      }, {
        letter: 'j',
        value: 10,
        label: '10'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    generateQuestionDegree(data) {
      let output = ` 
        <div class="question-box">
          <p class="question-field" id="` + data.QuestionNumber + `-question">` + data.QuestionNumber + '. ' + data.Text + `</p>
          <div class="button-section">` + this.generateOptionsDegree(data.QuestionNumber) + `</div>
        </div>
      `
      return output;
    },
    generateOptionsDegree(questionNumber) {
      let optionsMap = [{
        letter: 'a',
        value: 1,
        label: 'Strongly Disagree'
      }, {
        letter: 'b',
        value: 2,
        label: 'Disagree'
      }, {
        letter: 'c',
        value: 3,
        label: 'Neutral'
      }, {
        letter: 'd',
        value: 4,
        label: 'Agree'
      }, {
        letter: 'e',
        value: 5,
        label: 'Strongly Agree'
      },{
        letter: 'f',
        value: 0,
        label: 'Don\'t know'
      }];
      let output = '';
      for (let i = 0; i < optionsMap.length; i++) {
        let data = optionsMap[i];
        output += `
      
      <div class="form-check form-check-inline">
        <input
          type="radio"
          class="btn-check"
          name="Q` + questionNumber + `"
          id="` + questionNumber + data.letter + `"
          value="` + data.value + `"
          required
          oninvalid="$('#` + questionNumber + data.letter + `-label').addClass('unfocus'); $('#` + questionNumber +`-question').addClass('invalid-question');"
          onclick="$('#` + questionNumber + data.letter + `-label').removeClass('unfocus').addClass('focus'); $('#` + questionNumber +`-question').removeClass('invalid-question').addClass('valid-question');"
        />
        <label class="btn btn-outline-secondary" id="` + questionNumber + data.letter + `-label" for="` + questionNumber + data.letter + `">` + data.label + `</label>
      </div>
      `;
      }
      return output;
    },
    
    addJS(ids, data) {
      let url = 'https://be.talentsage.com'
      let baseUrl = window.location.protocol + '//' + window.location.host;
      if(baseUrl == "https://tstest.gcm3.com") {
        url = 'https://betest.gcm3.com'
      }
      else if(baseUrl == "https://uatapp.gcm3.com") {
        url = 'https://uatbe.gcm3.com'
      }
      else {
        url = 'https://be.talentsage.com'
      }

      let input = JSON.parse(data)
      
      let output = `
        
        function printPDF(){
              window.print()
        }
        function countCharacters() {
          let max = $(this).attr("maxlength");
          let length = $(this).val().length;
          let counter = max - length;
          let helper = $(this).next(".form-text");
          // Switch to the singular if there's exactly 1 character remaining
          if (counter !== 1) {
            helper.text(counter + " characters remaining");
          } else {
            helper.text(counter + " character remaining");
          }
          // Make it red if there are 0 characters remaining
          if (counter === 0) {
            helper.removeClass("text-muted");
            helper.addClass("text-danger");
          } else {
            helper.removeClass("text-danger");
            helper.addClass("text-muted");
          }
        }
        $(document).ready(function(){
          let config = {
            headers: {
              token: 'cCW7PW2CRotxuALrBuMob5lXgVhY4xo'
            }
          }
          let survey_assignment_id = new URL(location.href).searchParams.get('survey_assignment_id')
          let ind_id = new URL(location.href).searchParams.get('ind_id')
          let org_id = new URL(location.href).searchParams.get('org_id')
          let subOrg_id = new URL(location.href).searchParams.get('subOrg_id')
          let viewer_fullname = new URL(location.href).searchParams.get('viewer_fullname')
          let report_for_fullname = new URL(location.href).searchParams.get('report_for_fullname')
          let sex = new URL(location.href).searchParams.get('sex')
          let country = new URL(location.href).searchParams.get('country')
          let program_id = new URL(location.href).searchParams.get('program_id')
          let iteration_id = new URL(location.href).searchParams.get('iteration_id')
          let coach_id = new URL(location.href).searchParams.get('coach_id')
          let survey_template_id = new URL(location.href).searchParams.get('survey_template_id')
          let qsort_type = new URL(location.href).searchParams.get('qsort_type')
          let reqReOrder = false
          let noDuplicates = false
          let completeAnswer = false
          let run_mode = new URL(location.href).searchParams.get('run_mode')
          let org_acronym = new URL(location.href).searchParams.get('org_acronym')
          let org_name = new URL(location.href).searchParams.get('org_name')
          let suborg_name = new URL(location.href).searchParams.get('suborg_name')
          let program_name = new URL(location.href).searchParams.get('program_name')
          let iteration_name = new URL(location.href).searchParams.get('iteration_name')
          let report_template_name = new URL(location.href).searchParams.get('report_template_name')
          let participant_report_release_date = new URL(location.href).searchParams.get('participant_report_release_date')
          let client_logo = new URL(location.href).searchParams.get('client_logo')
          let brand_bgcolor = new URL(location.href).searchParams.get('brand_bgcolor')

          if (run_mode === "ReadOnly") {
            $('input').attr('disabled','disabled')
            $('select').attr('disabled','disabled')
            $('button').attr('disabled','disabled')
          }

          $(".front-page-client-logo-img").css("background-color", brand_bgcolor);
          $(".front-page-client-logo").attr("src", client_logo)
          $('.front-page-program-name').text(program_name)
          $('.front-page-survey-title').text(report_template_name)
          $('.front-page-survey-subject-name').text(report_for_fullname)
          $('.front-page-participant-report-release-date').text(participant_report_release_date)
          $('.front-page-downloaded-by').text(viewer_fullname)

          let today = new Date()
          let dd = today.getDate()
          let mm = today.getMonth() + 1
          const yyyy = today.getFullYear()

          if(mm < 10) mm = '0' +mm 
          if(dd < 10) dd = '0' +dd

          $('.front-page-date-today').text(dd+ '/' +mm+ '/' +yyyy)

          document.body.innerHTML = document.body.innerHTML.replace(/&amp;output_name/g, viewer_fullname)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;report_for_fullname/g, report_for_fullname)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;org_acronym/g, org_acronym)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;org_name/g, org_name)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;suborg_name/g, suborg_name)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;program_name/g, program_name)
          document.body.innerHTML = document.body.innerHTML.replace(/&amp;iteration_name/g, iteration_name)

          let divs = document.getElementsByClassName('reorder-box');
            if (divs.length > 0) {
              divs[0].style.display = 'block'; // Show the first div
              for (let i = 1; i < divs.length; i++) {
                divs[i].style.display = 'none'; // Hide the rest of the divs
              }
            }
        `
 
      // restore radio button answers
      for (let i = 0; i < input.length; i++) {
        const data = input[i];
        
        if (
          data.Template === 'LMC-Effectiveness-6' ||
          data.Template === 'LMC-Accuracy-5-P' ||
          data.Template === 'LMC-Agreement-6' ||
          data.Template === 'Select_YN' ||
          data.Template === 'LMC-Characteristic-5' ||
          data.Template === 'LMC-Net-Promoter-Score' ||
          data.Template === 'LMC-Degree'
        ) { 
          output += `
            axios
              .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}' + '`, config)' + `
              .then((res) => {
                let surveyResultList = res.data
                for (const data of surveyResultList) {
                                
                  let surveyStr = '[name = "'
                  surveyStr += data.statement_num
                  surveyStr += '"]'
                  surveyStr += '[value = "'
                  surveyStr += data.score
                  surveyStr += '"]'

                  $(surveyStr).prop('checked', true)              
                }
              })     
          `
          break
        }
      }
      // Script for reorder
      for (let i = 0; i < input.length; i++) {
        const data = input[i];
        if (data.Template === 'Re-order') {
          output += `
          reqReOrder = false
          let surveyData = []
          let reOrderQuestions = []

          axios
            .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}' + '`, config)' + `
            .then((res) => {
              for (const data of res.data) {
                if (data.record_type === "Ranking" && data.answer !== "") {
                  let question = data.answer
                  let rank = data.score
                  reOrderQuestions.push({question, rank})
                }
              }
              reOrderQuestions.sort((a, b) => (a.rank < b.rank) ? -1 : ((b.rank > a.rank) ? 1 : 0))
              for (const data of reOrderQuestions) {
                surveyData.push(data.question)
              }
              if (surveyData.length === 0) {
                reqReOrder = false
                `
              for (let i = 0; i < input.length; i++) {
                let data = input[i];
                if (data.Template == 'Re-order') {
                  output += `
                    surveyData.push("` + data.Text + `")
                  `
                }
              }
              output += `
              } else {
                reqReOrder = true
              }

              const rank_list = document.getElementById('rank')
              const draggable_list = document.getElementById('box')

              // Store listitems
              const listItems = []
              const listInput = []
              const result = []
              let obj = {}
              createList()
              createRank()

              function createList() {
                [...surveyData].forEach((question, index) => {
                  // Div
                  const listItem = document.createElement('div')
                  listItem.setAttribute('data-index', index)
                  listItem.setAttribute('id', 'answer')
                  listItem.classList.add('item')
                  listItem.draggable = true
                  listItem.textContent = question
                  listItems.push(listItem)
                  draggable_list.appendChild(listItem)

                  if (index + 1 == surveyData.length) {
                    const lastItem = document.createElement('div')
                    lastItem.classList.add('item')
                    listItems.push(lastItem)
                    draggable_list.appendChild(lastItem)
                  }
                })
              }

              function createRank() {
                [...surveyData].forEach((item, index) => {
                  // Div
                  const rankItem = document.createElement('div')
                  rankItem.classList.add('rank-no')
                  rankItem.textContent = index + 1
                  rank_list.appendChild(rankItem)
                })
              }

              // === Define Variables and Elements ===
              let elements = document.querySelectorAll('.box .item')
              let wrapper = document.getElementById('box')
              let itemClip = document.getElementById('itemClip')

              let targetEl
              let scopeObj

              // === Event Binding ===
              for (let i = 0, max = elements.length; i < max; i++) {
                elements[i].addEventListener('dragstart', handleDrag)
                elements[i].addEventListener('dragend', handleDragEnd)
                elements[i].addEventListener('dragenter', handleDragEnter)
                if (i + 1 == elements.length) {
                  elements[i - 1].addEventListener('touchstart', handleTouch)
                  elements[i - 1].addEventListener('touchend', handleTouchEnd)
                  elements[i - 1].addEventListener('touchmove', handleTouchMove)
                } else {
                  elements[i].addEventListener('touchstart', handleTouch)
                  elements[i].addEventListener('touchend', handleTouchEnd)
                  elements[i].addEventListener('touchmove', handleTouchMove)   
                }
              }

              // === Function Kits ===
              function handleDrag(event) {
                targetEl = event.target
                targetEl.classList.add('onDrag')
                reqReOrder = true
              }

              function handleDragEnd(event) {
                targetEl = event.target
                targetEl.classList.remove('onDrag')
                const Qitems = wrapper.querySelectorAll('#answer')
                let result = []
                Qitems.forEach((listItem, index) => {
                  let rank = index + 1
                  let text = listItem.innerText
                  result.push({rank,text})
                })
                `
                input.forEach(data => {
                  if (data.Template == 'Re-order') {
                    output += `
                      for (const key of result) {
                        if (key.text === "` + data.Text + `") {
                          axios
                            .put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                              {
                                answer:  "` + data.Text + `",
                                score: key.rank,
                                modified_by: ind_id,
                              }, config)
                            .then(function (res) {
                              console.log(res)
                            })
                            .catch(function (error) {
                              console.log(error)
                            })
                        }
                      }      
                    `
                  }
                })
              output += `
              }

              function handleDragEnter(event) {
                wrapper.insertBefore(targetEl, event.target)
              }

              function handleTouch(event) {
                defineScope(elements)
                targetEl = event.target
                itemClip.style.top = event.changedTouches[0].pageY + 'px'
                itemClip.style.left = event.changedTouches[0].pageX + 'px'
                itemClip.innerText = event.target.innerText
                itemClip.classList.remove('hide')
                targetEl.classList.add('onDrag')
                reqReOrder = true
              }

              function handleTouchEnd(event) {
                itemClip.classList.add('hide')
                targetEl.classList.remove('onDrag')
                const Qitems = wrapper.querySelectorAll('#answer')
                reqReOrder = true
                let result = []
                Qitems.forEach((listItem, index) => {
                  let rank = index + 1
                  let text = listItem.innerText
                  result.push({rank,text})
                })
                `
                input.forEach(data => {
                  if (data.Template == 'Re-order') {
                    output += `
                      for (const key of result) {
                        if (key.text === "` + data.Text + `") {
                          axios
                            .put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                              {
                                answer:  "` + data.Text + `",
                                score: key.rank,
                                modified_by: ind_id,
                              }, config)
                            .then(function (res) {
                              console.log(res)
                            })
                            .catch(function (error) {
                              console.log(error)
                            })
                        }
                      }
                    `
                  }
                });
              output += `
              }

              function handleTouchMove(event) {
                itemClip.style.top = event.changedTouches[0].pageY + 'px'
                itemClip.style.left = event.changedTouches[0].pageX  + 'px'
                hitTest(event.changedTouches[0].pageX, event.changedTouches[0].pageY)
              }

              function hitTest(thisX, thisY) {
                for (let i = 0, max = scopeObj.length; i < max; i++) {
                  if (thisX > scopeObj[i].startX && thisX < scopeObj[i].endX) {
                    if (thisY > scopeObj[i].startY && thisY < scopeObj[i].endY) {        
                      wrapper.insertBefore(targetEl, scopeObj[i].target)
                      return
                    }
                  }
                }
              }

              function defineScope(elementArray) {
                scopeObj = []
                for (let i = 0, max = elementArray.length; i < max; i++) {
                  let newObj = {}
                  newObj.target = elementArray[i]
                  newObj.startX = elementArray[i].offsetLeft
                  newObj.endX = elementArray[i].offsetLeft + elementArray[i].offsetWidth
                  newObj.startY = elementArray[i].offsetTop
                  newObj.endY = elementArray[i].offsetTop + elementArray[i].offsetHeight
                  scopeObj.push(newObj)
                }
              }

            }) // end of axios call
        `
          break
        }
      }


      // Getting the value in database
      input.forEach(data => {
        if (data.Template === 'Free-text') {
          output += `
        $('[name="Q` + data.QuestionNumber + `"]').each(countCharacters);
        $('[name="Q` + data.QuestionNumber + `"]').keyup(countCharacters);
        axios
          .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
          .then((res) => {
            for (const stored of res.data) {
              $('[name="Q` + data.QuestionNumber + `"]').val(stored.answer)
            }
          })
          .catch((error) => {
            console.log(error)
          })
        `
        }
        if (data.Template === 'TagDisplay') {
          output += `
        axios
          .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
          .then((res) => {
            for (const stored of res.data) {
              $('[name="Q` + data.QuestionNumber + `"]').val(stored.score)
            }
          })
          .catch((error) => {
            console.log(error)
          })
        `
          if (data.Tag === '20') {
            output += `
            axios
            .get(` + '`' + `${url}` + '/survey_assignment_tags/sharing/${org_id}/${survey_assignment_id}' + '`, config)' + `
              .then((res) => {
                for (const data of res.data) {
                  if (data.do_not_show_coach_sharing === 1) {
                    $('#coach-access').attr("hidden", true);
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              })
          `
          }
          if (data.Tag === '4') {
            output += `
            axios
            .get(` + '`' + `${url}` + '/survey_assignment_tags/sharing/${org_id}/${survey_assignment_id}' + '`, config)' + `
              .then((res) => {
                for (const data of res.data) {
                  if (data.show_coach_group_report === 0) {
                    $('#coach-group-access').attr("hidden", true);
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              })
          `
          }
          if (data.Tag === '19') {
            output += `
            axios
            .get(` + '`' + `${url}` + '/survey_assignment_tags/sharing/${org_id}/${survey_assignment_id}' + '`, config)' + `
              .then((res) => {
                for (const data of res.data) {
                  if (data.show_hr_report === 0) {
                    $('#hr-access').attr("hidden", true);
                  }
                }
              })
              .catch((error) => {
                console.log(error)
              })
          `
          }
        }
        if (data.Template === 'Select_Country') {
          output += `
            axios.get('${url}/b5-get-countries', config)
              .then((res) => {
                  countryList = res.data

                  let outputHTML = '<select class="form-select" name="Q` + data.QuestionNumber + `" required>'
                  outputHTML += '<option value="" disabled selected>- Select -</option>'

                  countryList.map((result, index) => {
                      outputHTML += ` +
                      '`' +
                        '<option value="${result.country}">${result.country}</option>' +     
                        '`' +    
                      `
                  })
                  outputHTML += '</select>'

                  $('.country_list').html(outputHTML)
              })
              .catch((error) => {
                console.log(error)
              })

            axios
              .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
              .then((res) => {
                for (const stored of res.data) {
                  $('[name="Q` + data.QuestionNumber + `"]').val(stored.answer)
                }
              })
              .catch((error) => {
                console.log(error)
              })
          `
        }
        if (data.Template === 'Select_Gender') {
          output += `
          axios
            .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
            .then((res) => {
              for (const stored of res.data) {
                $('[name="Q` + data.QuestionNumber + `"]').val(stored.answer)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        `
        }
        if (data.Template === 'Select_Age') {
          output += `
          axios
            .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
            .then((res) => {
              for (const stored of res.data) {
                $('[name="Q` + data.QuestionNumber + `"]').val(stored.answer)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        `
        }
        if (data.Template === 'Select_YN') {
          output += `
          axios
            .get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`, config)' + `          
            .then((res) => {
              for (const stored of res.data) {
                $('[name="Q` + data.QuestionNumber + `"]').val(stored.answer)
              }
            })
            .catch((error) => {
              console.log(error)
            })
        `
        }
      })
      // Update answers in survey_result table
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        output += `
          $('[name="Q${id}"]').change(async function () {
            let value = $('[name="Q${id}"]:checked').val()
            let label = $('[name="Q${id}"]:checked').next().text()

            try {
              const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${id}` + '`,' + `
                {
                  answer: label,
                  score: value,
                  modified_by: ind_id,
                }, config)
              if (res.status === 200) {
                console.log(res)
              }
            } catch (error) {
              console.log(error)
            }
          })
        `
      }
      for (let i = 0; i < input.length; i++) {
        const data = input[i]
        if (data.Template == 'Free-text') {
          output += `            
            $('[name="Q` + data.QuestionNumber + `"]').focusout(async function () {
              let inputValue = $('[name="Q` + data.QuestionNumber + `"]').val()

              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: inputValue,
                    score: 0,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }
            })
          `
        }
        if (data.Template == 'Select_Country') {
          output += `
            $(document).on('change', '[name="Q` + data.QuestionNumber + `"]', async function () {
              let selected = $(this).children('option:selected').val()

              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: selected,
                    score: 0,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }
            })  
          `
        }
        if (data.Template == 'Select_Gender') {
          output += `
            $('[name="Q` + data.QuestionNumber + `"]').change(async function () {
              let selected = $(this).children('option:selected').val()

              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: selected,
                    score: 0,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }
            })
          `
        }
        if (data.Template == 'Select_Age') {
          output += `
            $('[name="Q` + data.QuestionNumber + `"]').change(async function () {
              let selected = $(this).children('option:selected').val()
    
              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: selected,
                    score: 0,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }     
            })
          `
        }
        if (data.Template == 'Select_YN') {
          output += `
            $('[name="Q` + data.QuestionNumber + `"]').change(async function () {
              let selected = $(this).children('option:selected').val()
              let selectedText = $(this).children('option:selected').text()

              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: selectedText,
                    score: selected,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }
            })
          `
        }
        if (data.Template === 'TagDisplay') {
          output += `
            $('[name="Q` + data.QuestionNumber + `"]').change(async function () {
              let selected = $(this).children('option:selected').val()
              let selectedText = $(this).children('option:selected').text()
          `
          if (data.Tag === '20') {
            output += `
              axios
                .put(` + '`' + `${url}` + '/survey-assignment/coach-granted/${survey_assignment_id}' + '`,' + `
                {
                  coach_access_granted: selected,
                  modified_by: ind_id,
                }, config)
            `
          }
          if (data.Tag === '4') {
            output += `
              axios
                .put(` + '`' + `${url}` + '/survey-assignment/coach-group-granted/${survey_assignment_id}' + '`,' + `
                {
                  coach_group_access_granted: selected,
                  modified_by: ind_id,
                }, config)
            `
          }
          if (data.Tag === '19') {
            output += `
              axios
                .put(` + '`' + `${url}` + '/survey-assignment/hr-granted/${survey_assignment_id}' + '`,' + `
                {
                  hr_access_granted: selected,
                  modified_by: ind_id,
                }, config)
            `
          }
          output += `
              try {
                const res = await axios.put(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}/Q' + `${data.QuestionNumber}` + '`,' + `
                  {
                    answer: selectedText,
                    score: selected,
                    modified_by: ind_id,
                  }, config)
                if (res.status === 200) {
                  console.log(res)
                }
              } catch (error) {
                console.log(error)
              }
            })
          `
        }
        if (data.Template === 'Calc') { 
          output += `
            $('#submitSurvey').submit(async function (e) {
              $('#submit_btn').prop('disabled', true)
              e.preventDefault()
              let duplicateList = []
              // let calculationEndpoint = ''

              // get calculation endpoint
              // try {
              //   const res = await axios.get(` + '`' + `${url}` + '/survey-templates/calculate/${survey_template_id}' + '`, config)' + `
              //   if (res.status === 200) {
              //     calculationEndpoint = res.data.calculate_survey_endpoint 
              //   }
              //   console.log(calculationEndpoint)
              // } catch (e) {
              //   console.log(e)
              // }

              // check if answer is complete
              try {
                const res = await axios.post(` + '`' + `${url}` + '/survey-results/missing-answer' + '`,' + `
                  {
                    survey_assignment_id: survey_assignment_id,
                    modified_by: ind_id,
                  }, config)
                if (res.data.empty_answer < 1) {
                  completeAnswer = true
                  try {
                    console.log("Complete answer")
                    axios.put(` + '`' + `${url}` + '/survey-assignment/survey-complete/${survey_assignment_id}' + '`,' + `
                    {
                      complete_survey: 1,
                      modified_by: ind_id,
                    }, config)
                  } catch (e) {
                    console.log(e)
                  }
                } else {
                  completeAnswer = false
                  console.log("Answer Not Complete")
                }
              } catch (e) {
                console.log(e)
              }

              // check for duplicates
              try {
                const res = await axios.post(` + '`' + `${url}` + '/survey-results/duplicate-answer' + '`,' + `
                  {
                    survey_assignment_id: survey_assignment_id,
                    modified_by: ind_id,
                  }, config)
                if (res.data.length < 1) {
                  noDuplicates = true
                  console.log("No Duplicates")
                  try {
                    axios.put(` + '`' + `${url}` + '/survey-assignment/survey-duplicate/${survey_assignment_id}' + '`,' + `
                      {
                        no_duplicates: 1,
                        modified_by: ind_id,
                      }, config)
                  } catch (e) {
                    console.log(e)
                  }
                } else {
                  noDuplicates = false
                  for (const data of res.data) {
                    duplicateList.push(data.has_duplicate_survey_result_id)
                  }
                  try {
                    const res = await axios.delete(` + '`' + `${url}` + '/survey-results/delete/duplicate' + '`,' + `
                      {
                        headers: {
                          token: 'cCW7PW2CRotxuALrBuMob5lXgVhY4xo'
                        },
                        data: {
                          survey_result_id: duplicateList
                        }
                      }
                    )
                    if (res.status === 200) {
                      console.log("Duplicates Deleted!")
                    }
                  } catch (e) {
                    console.log(e)
                  }
                }
              } catch (e) {
                console.log(e)
              }

              // if (reqReOrder === false) {
              //   Swal.fire({
              //     title: 'Incomplete!',
              //     text: 'Please Re-order the Competency Importance Index!',
              //     icon: 'warning',
              //     confirmButtonText: 'Go Back',
              //     confirmButtonColor: '#3085d6',
              //     allowOutsideClick: false,
              //   })
              //   .then((result) => {
              //     if (result.isConfirmed) {
              //       $('#submit_btn').prop('disabled', false)
              //     }
              //   })
              // }

              if (completeAnswer === false) {
                Swal.fire({
                  title: 'Incomplete!',
                  text: 'Please complete the survey!',
                  icon: 'warning',
                  confirmButtonText: 'Go Back',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    $('#submit_btn').prop('disabled', false)
                    document.location.reload()
                  }
                })
              }

              if (noDuplicates === false) {
                Swal.fire({
                  title: 'Deleting duplicates...',
                  text: 'Please resubmit again.',
                  icon: 'info',
                  confirmButtonText: 'Go Back',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    $('#submit_btn').prop('disabled', false)
                  }
                })
              }

              // if (calculationEndpoint === '' || calculationEndpoint === undefined) {
              //   Swal.fire({
              //     title: 'No calculation available',
              //     text: 'Please contact customer support.',
              //     icon: 'info',
              //     confirmButtonText: 'Go Back',
              //     confirmButtonColor: '#3085d6',
              //     allowOutsideClick: false,
              //   })
              //   .then((result) => {
              //     if (result.isConfirmed) {
              //       $('#submit_btn').prop('disabled', false)
              //     }
              //   })
              // }

              // reqReOrder === true && calculationEndpoint !== '' && calculationEndpoint !== undefined
              if(completeAnswer === true && noDuplicates === true){
                Swal.fire({
                  title: 'Are you sure want to submit?',
                  text: "You won't be able to revert this!",
                  icon: 'warning',
                  showDenyButton: true,
                  confirmButtonColor: '#6c757d',
                  confirmButtonText: 'Submit',
                  denyButtonText: 'Cancel',
                  allowOutsideClick: false,
                })
                .then(async (result) => {
                  if (result.isConfirmed) {
                    let survey_responses = [] 
                    try {
                      const res = await axios.get(` + '`' + `${url}` + '/survey-results/${survey_assignment_id}' + '`, config)' + `
                      if (res.status === 200) {
                        surveyResultList = res.data
                        surveyResultList.forEach((data) => {
                          let q = data.statement_num
                          let a = data.answer
                          let r = data.score
                          let jsonString = JSON.stringify({ q, a, r })
                          survey_responses.push(jsonString)
                        })
                      }
                    } catch (e) {
                      console.log(e)
                    }
                    
                    // Calculate survey and insert calculations in r360_raw table
                    try {
                      const res = await axios.post(` + '`' + `${url}` + '/calculate360/${survey_assignment_id}`,' + `${JSON.stringify(data.Text)}` + `, config)
                      if (res.status === 200) {
                        console.log("Calculations done!")
                      }
                    } catch (e) {
                      console.log(e)
                    }

                    // if no duplicate and answer is complete, set submitted status = 1
                    try {
                      const res = await axios.put(` + '`' + `${url}` + '/survey-assignment/${survey_assignment_id}' + '`,' + `
                        {
                          submitted_status: '1',
                          stmt_answer: ` + '`[' + '${survey_responses}' + ']`,' + `
                          modified_by: ind_id,
                        }, config)
                      if (res.status === 200) {
                        try {
                          axios.get(` + '`' + `${url}` + '/submit-survey-email/${survey_assignment_id}' + '`, config)' + `
                        } catch (e) {
                          console.log(e)
                        }
                      }
                    } catch (e) {
                      console.log(e)
                    }

                    // if nominee submitted, add 1 in parent number of respondents
                    try {
                      const res = await axios.get(` + '`' + `${url}` + '/survey-assignment/view-one/${survey_assignment_id}' + '`, config)' + `
                      if (res.status === 200) {
                        let assignedParentSurveyId = res.data.parent_survey_assignment_id
                        if (assignedParentSurveyId === null || assignedParentSurveyId === undefined) {
                          console.log('Participant')
                        } else {
                          axios
                            .get(` + '`' + `${url}` + '/survey-assignment/view-one/${assignedParentSurveyId}' + '`, config)' + `
                            .then((res) => {
                              axios
                                .put(` + '`' + `${url}` + '/survey-assignment/number-of-respondents/${assignedParentSurveyId}' + '`,' + `
                                {
                                  number_of_respondents : res.data.number_of_respondents + 1,
                                  modified_by : ind_id
                                },
                                config
                              )
                            })
                            .catch((e) => {
                              console.log(e)
                            })
                        }
                      }
                    } catch (e) {
                      console.log(e)
                    }
                    Swal.fire({
                      title: "Good job!",
                      text: "Survey submitted successfully!",
                      icon: "success",
                      confirmButtonText: "Done",
                      allowOutsideClick: false
                    }).then((result) => {
                      if (result.isConfirmed) {
                        window.history.back()
                        // console.log("COMPLETED")
                      }
                    })
                  }
                  if (result.isDenied) {
                    $('#submit_btn').prop('disabled', false)
                  }
                })
              } 
            })
          })`
        }
      }
      
      return output;
    }
  }
}
</script>