<template>
    <base-card>
        <Header label="Survey Builder" />
        <rail-road
            :steps="steps"
            :activeStep="activeStep"
            :progressWidth="progressWidth"
        />
        <div class="main-content">
            <div v-show="activeStep === 1">
                <div class="body-container" v-show="!surveyProcess">
                    <p>
                        Survey questions are not refreshed from the library if you use an existing .srv file. If you need to refresh any questions, please start a new survey from scratch
                    </p>
                    <br>
                    <br>
                    <div class="container">
                        <div>
                            <button @click.prevent="createSurvey">
                                Create new survey
                            </button>
                        </div>
                        <p>or</p>
                        <div>
                            <FileUploader
                                :onSubmit="onFileSubmit"
                                ref="file"
                                dynamicLabel="Edit an existing Survey"
                                @change="onClickButton"
                            />
                        </div>
                    </div>
                </div>

                <div v-show="surveyProcess">
                    <div class="textOnInput">
                        <label for="selectOrganization"
                            ><DescriptionInline label="Organization"
                        /></label>
                        <input
                            class="formControl"
                            type="text"
                            :value="orgName"
                            disabled
                        />
                    </div>

                    <div class="textOnInput">
                        <label for="selectSubOrganization"
                            ><DescriptionInline label="Select sub-organization"
                        /></label>
                        <select
                            class="formControl"
                            id="selectSubOrganization"
                            v-model="suborgName"
                            @change="selectSubOrg($event)"
                        >
                            <option value="0">Select sub-organization</option>
                            <option
                                v-for="data in suborgList"
                                :key="data.suborg_id"
                            >
                                {{ data.suborg_name }}
                            </option>
                        </select>
                    </div>

                    <div class="textOnInput">
                        <label for="selectProgram"
                            ><DescriptionInline label="Select program"
                        /></label>
                        <select
                            class="formControl"
                            id="selectProgram"
                            v-model="programName"
                            @change="selectProgram($event)"
                        >
                            <option value="0">Select program</option>
                            <option
                                v-for="data in programList"
                                :key="data.program_id"
                            >
                                {{ data.program_name }}
                            </option>
                        </select>
                    </div>

                    <div class="textOnInput">
                        <label for="selectIteration"
                            ><DescriptionInline label="Select iteration"
                        /></label>
                        <select
                            class="formControl"
                            id="selectIteration"
                            name="subOrganization"
                            v-model="iterationName"
                            @change="selectIteration($event)"
                        >
                            <option value="0">Select iteration</option>
                            <option
                                v-for="data in iterationList"
                                :key="data.iteration_id"
                            >
                                {{ data.iteration_name }}
                            </option>
                        </select>
                    </div>

                    <div class="textOnInput">
                        <label for=""
                            ><DescriptionInline label="Survey for"
                        /></label>
                        <div>
                            <input
                                type="radio"
                                name="surveyFor"
                                @change="selectSurveyFor($event)"
                                id="forParticipant"
                                v-model="surveyFor"
                                value="1"
                            />
                            <label for="forParticipant"
                                ><DescriptionInline label="Participant"
                            /></label>
                            <input
                                type="radio"
                                name="surveyFor"
                                @change="selectSurveyFor($event)"
                                id="forNominee"
                                v-model="surveyFor"
                                value="0"
                            />
                            <label for="forNominee"
                                ><DescriptionInline label="Nominee"
                            /></label>
                        </div>
                    </div>

                    <div class="textOnInput" v-if="surveyFor === '0'">
                        <label for="selectParticipantSurvey"
                            ><DescriptionInline label="Participant Survey"
                        /></label>
                        <select
                            class="formControl"
                            id="selectParticipantSurvey"
                            name="selectParticipantSurvey"
                            v-model="participantSurveyId"
                            @change="selectParticipantSurvey($event)"
                        >
                            <option value="0">Select Participant Survey</option>
                            <option
                                v-for="data in surveyTemplateList"
                                :key="data.survey_template_id"
                                :value="data.survey_template_id"
                            >
                                {{ data.survey_template_name }}
                            </option>
                        </select>
                    </div>

                    <div class="textOnInput">
                        <label for="selectIteration"
                            ><DescriptionInline label="Survey name"
                        /></label>
                        <input
                            class="formControl"
                            type="text"
                            v-model.lazy="surveyName"
                            @change="validateSurveyName"
                        />
                        <description-inline
                            class="invalid"
                            label="Survey name taken. Choose a different name"
                            v-if="!validSurveyName"
                        />
                    </div>

                    <div class="textOnInput">
                        <label for="SurveyIntro"
                            ><DescriptionInline
                                label="Survey introduction and instruction"
                        /></label>
                        <textarea
                            class="formControl"
                            name="SurveyIntro"
                            id="SurveyIntro"
                            cols="30"
                            rows="7"
                            v-model="chosenInstruction"
                        ></textarea>
                    </div>
                </div>
            </div>

            <div v-show="activeStep === 2">
                <base-dialog
                    :brandData="brandData"
                    :show="openModal"
                    title="Competency list"
                    @close="handleModal"
                >
                    <h1>Selected competencies</h1>
                    <table id="table">
                        <thead>
                            <tr>
                                <th
                                    style="
                                        background-color: #031b61;
                                        color: white;
                                    "
                                    v-for="data in table_headers_competency"
                                    :key="data.colName"
                                >
                                    <a
                                        @click="sort(data)"
                                        style="
                                            display: flex;
                                            flex-direction: row;
                                            cursor: pointer;
                                        "
                                    >
                                        {{ data.colName }}

                                        <!-- <div class="sort-icon" v-if="sortBy == data.colName">
                  <a v-if="sortDirection == 1"
                    ><i class="fa-solid fa-sort-up"></i
                  ></a>
                  <a v-else
                    ><i class="fa-solid fa-sort-down"></i
                  ></a>
                </div> -->
                                    </a>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search competency"
                                            v-model="chosenCompetencyInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="textarea"
                                            placeholder="Search description"
                                            v-model="chosenDescriptionInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search status"
                                            v-model="chosenStatusInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style="min-width: 10px"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search source"
                                            v-model="chosenSourceInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search author"
                                            v-model="chosenAddedbyInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            class="input1"
                                            type="datetime-local"
                                            v-model="chosenValidDateInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Participant level"
                                            v-model="
                                                chosenParticipantLevelInput
                                            "
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search language"
                                            v-model="chosenLanguageInput"
                                            @input="
                                                filterTable(
                                                    'chosenCompetencyList'
                                                )
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr
                                v-for="data in filteredChosenCompetencyList"
                                :key="data.competency_id"
                            >
                                <td>{{ data.competency_name }}</td>
                                <td>{{ data.competency_desc }}</td>
                                <td>{{ data.status }}</td>
                                <td>{{ data.source }}</td>
                                <td>{{ data.added_by }}</td>
                                <td>{{ data.valid_dates }}</td>
                                <td>{{ data.participant_level }}</td>
                                <td>{{ data.language }}</td>
                                <td>
                                    <button
                                        @click.prevent="
                                            removeCompetency(data.competency_id)
                                        "
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <h1>Available competencies</h1>
                    <table id="table">
                        <thead>
                            <tr>
                                <th
                                    style="
                                        background-color: #031b61;
                                        color: white;
                                    "
                                    v-for="data in table_headers_competency"
                                    :key="data.colName"
                                >
                                    <a
                                        @click="sort(data)"
                                        style="
                                            display: flex;
                                            flex-direction: row;
                                            cursor: pointer;
                                        "
                                    >
                                        {{ data.colName }}

                                        <!-- <div class="sort-icon" v-if="sortBy == data.colName">
                  <a v-if="sortDirection == 1"
                    ><i class="fa-solid fa-sort-up"></i
                  ></a>
                  <a v-else
                    ><i class="fa-solid fa-sort-down"></i
                  ></a>
                </div> -->
                                    </a>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search competency"
                                            v-model="inputedCompetency"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="textarea"
                                            placeholder="Search description"
                                            v-model="inputedDescription"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search status"
                                            v-model="inputedStatus"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style="min-width: 10px"
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search source"
                                            v-model="inputedSource"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search author"
                                            v-model="inputedAddedby"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            class="input1"
                                            type="datetime-local"
                                            v-model="inputedValidDate"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Participant level"
                                            v-model="inputedParticipantLevel"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="input-container">
                                        <input
                                            type="text"
                                            placeholder="Search language"
                                            v-model="inputedLanguage"
                                            @input="
                                                filterTable('competencyList')
                                            "
                                            style=""
                                        />
                                    </div>
                                </td>
                            </tr>
                            <tr
                                v-for="data in filteredCompetencyList"
                                :key="data.competency_id"
                            >
                                <td>{{ data.competency_name }}</td>
                                <td>{{ data.competency_desc }}</td>
                                <td>{{ data.status }}</td>
                                <td>{{ data.source }}</td>
                                <td>{{ data.added_by }}</td>
                                <td>{{ data.valid_dates }}</td>
                                <td>{{ data.participant_level }}</td>
                                <td>{{ data.language }}</td>
                                <td>
                                    <button
                                        @click.prevent="
                                            addCompetency(data.competency_id)
                                        "
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </base-dialog>

                <draggable
                    :list="list"
                    :disabled="!enabled"
                    item-key="name"
                    class="list-group"
                    ghost-class="ghost"
                    :move="checkMove"
                    handle=".handle"
                >
                    <template #item="{ element }">
                        <div
                            class="list-group-item"
                            :class="{ 'not-draggable': !enabled }"
                        >
                            <div class="tabs">
                                <div class="tab">
                                    <i class="fa fa-align-justify handle"></i>
                                    <input
                                        class="question-set-input"
                                        type="checkbox"
                                        :checked="element.isChecked"
                                        v-model="element.isChecked"
                                        @change="handleCheck(element.id)"
                                    />
                                    <input
                                        class="accordion-input"
                                        type="checkbox"
                                        :id="element.id"
                                    />
                                    <label
                                        class="tab-label"
                                        :for="element.id"
                                        >{{ element.name }}</label
                                    >
                                    <div class="tab-content">
                                        <!--? Competencies -->
                                        <div v-if="element.id === 'Competencies'">
                                            <div class="textOnInput">
                                                <label for="selectLikert"
                                                    ><DescriptionInline
                                                        label="Select Likert"
                                                /></label>
                                                <select
                                                    class="formControl"
                                                    id="selectLikert"
                                                    name="likert"
                                                    v-model="chosenLikert"
                                                    @change="selectLikert($event)"
                                                >
                                                    <option>Select Likert</option>
                                                    <option v-for="data in likertList" :key="data">
                                                        {{ data.likert_name }}
                                                    </option>
                                                </select>
                                            </div>
                                            <br />
                                            <ButtonSubmit
                                                label="Choose competency"
                                                @click="handleModal"
                                            />
                                            <draggable
                                                :list="element.selectedCompetencies"
                                                :disabled="!enabled"
                                                item-key="name"
                                                class="list-group"
                                                ghost-class="ghost"
                                                :move="checkMove"
                                                handle=".handle"
                                            >
                                                <template #item="{ element }">
                                                    <div
                                                        class="list-group-item"
                                                        :class="{ 'not-draggable': !enabled }"
                                                    >
                                                        <div class="tabs">
                                                            <div class="tab">
                                                                <i class="fa fa-align-justify handle"></i>
                                                                <input
                                                                    class="question-set-input"
                                                                    type="checkbox"
                                                                    v-model="element.isChecked"
                                                                    @change="handleCompetency(element)"
                                                                    :disabled="disableCompetency"
                                                                />
                                                                <input
                                                                    class="accordion-input"
                                                                    type="checkbox"
                                                                    :id="'comp' + element.competency_id"
                                                                />
                                                                <label
                                                                    class="tab-label"
                                                                    :for="'comp' + element.competency_id"
                                                                    >{{ element.competency_name }}
                                                                    </label>
                                                                <div class="tab-content">
                                                                    <div class="section-intro">
                                                                        <p class="intro-header">Section Introduction</p>
                                                                        <p class="intro-content">{{element.competency_desc}}</p>
                                                                    </div>
                                                                    <div class="section-behavior">
                                                                        <p class="behavior-header">Behavior</p>
                                                                        <div class="behavior-content">
                                                                            <div v-for="data in element.behaviors" :key="data.behavior_id">
                                                                                <label :for="data.behavior_id">{{ data.behavior_desc }}</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                            </draggable>
                                        </div>
                                        <!--? Competency Ranking -->
                                        <div v-else-if="element.id === 'CompetencyRanking'">
                                            <div class="section-intro">
                                                <p class="intro-header">Section Introduction</p>
                                                <p class="intro-content">{{ element.introduction }}</p>
                                            </div>
                                            <div class="section-behavior">
                                                <p class="behavior-header">Competencies</p>
                                                <div class="behavior-content">
                                                    <div v-for="data in element.questions" :key="element.id + data.competency_id">
                                                        <input 
                                                            type="checkbox" 
                                                            :id="element.id + data.competency_id"
                                                            v-model="data.isChecked"
                                                            :disabled="!element.isChecked"
                                                        />
                                                        <label :for="element.id + data.competency_id">
                                                            {{ data.competency_name }} - {{ data.cii_desc }}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!--? Open-ended Questions -->
                                        <div v-else-if="element.id === 'OpenEndedQuestions'">
                                            <div class="section-intro">
                                                <p class="intro-header">
                                                    Section Introduction
                                                </p>
                                                <p class="intro-content">
                                                    {{ element.introduction }}
                                                </p>
                                            </div>
                                            <div class="section-behavior">
                                                <p class="behavior-header">
                                                    Questions
                                                </p>
                                                <div class="behavior-content">
                                                    <draggable
                                                        :list="element.questions"
                                                        :disabled="!enabled"
                                                        item-key="name"
                                                        class="list-group"
                                                        ghost-class="ghost"
                                                        :move="checkMove"
                                                        handle=".handle"
                                                    >
                                                        <template #item="{ element }">
                                                            <div 
                                                                class="list-group-item"
                                                            >
                                                                <div class="oeq-item">
                                                                    <i class="fa fa-align-justify handle"></i>
                                                                    <input
                                                                    type="checkbox"
                                                                    :id="'OpenendedId' + element.oeq_id"
                                                                    :checked="element.isChecked"
                                                                    v-model="element.isChecked"
                                                                    :disabled="disableOpenended"
                                                                    />
                                                                    <label class="oeq-text" :for="'OpenendedId' + element.oeq_id">{{element.question}}
                                                                        <span class="oeq_details">
                                                                            {{
                                                                                `(Language: ${element.language} | Participant Level: ${element.participant_level})`
                                                                            }}
                                                                        </span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </draggable>
                                                </div>
                                            </div>
                                        </div>
                                        <!--? Organizational Climate -->
                                        <div v-else-if="element.id === 'OrganizationalClimate'">
                                            <div class="section-intro">
                                                <p class="intro-header">Section Introduction</p>
                                                <p class="intro-content">{{ element.introduction }}</p>
                                            </div>
                                            <div class="section-behavior">
                                                <p class="behavior-header">Questions</p>
                                                <div class="behavior-content">
                                                    <draggable
                                                        :list="element.questions"
                                                        :disabled="!enabled"
                                                        item-key="name"
                                                        class="list-group"
                                                        ghost-class="ghost"
                                                        :move="checkMove"
                                                    >
                                                        <template #item="{ element }">
                                                            <div
                                                                class="list-group-item"
                                                                :class="{ 'not-draggable': !enabled }"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    :id="'OrgClimateId' + element.org_climate_id"
                                                                    :checked="element.isChecked"
                                                                    v-model="element.isChecked"
                                                                    :disabled="disableOrgClimate"
                                                                />
                                                                <label :for="'OrgClimateId' + element.org_climate_id">
                                                                    {{ element.question }}
                                                                </label>
                                                            </div>
                                                        </template>
                                                    </draggable>
                                                </div>
                                            </div>
                                        </div>
                                        <!--? Collaboration strengths ranking -->
                                        <div v-else-if="element.id === 'NetPromoterScore'">
                                            <div class="section-intro">
                                                <p class="intro-header">Section Introduction</p>
                                                <p class="intro-content">{{ element.introduction }}</p>
                                            </div>
                                            <div class="section-behavior">
                                                <p class="behavior-header">Questions</p>
                                                <div class="behavior-content">
                                                    <draggable
                                                        :list="element.questions"
                                                        :disabled="!enabled"
                                                        item-key="name"
                                                        class="list-group"
                                                        ghost-class="ghost"
                                                        :move="checkMove"
                                                    >
                                                        <template #item="{ element }">
                                                            <div
                                                                class="list-group-item"
                                                                :class="{ 'not-draggable': !enabled }"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    :id="'NetPromoterId' + element.nps_id"
                                                                    :checked="element.isChecked"
                                                                    v-model="element.isChecked"
                                                                    :disabled="disableNetPromoter"
                                                                />
                                                                <label :for="'NetPromoterId' + element.nps_id">
                                                                    {{ element.nps_question }}
                                                                </label>
                                                            </div>
                                                        </template>
                                                    </draggable>
                                                </div>
                                            </div>
                                        </div>
                                        <!--? Report Sharing Options -->
                                        <div v-else-if="element.id === 'ReportSharingOptions'">
                                            <div class="section-intro">
                                                <p class="intro-header">Section Introduction</p>
                                                <p class="intro-content">{{ element.introduction }}</p>
                                            </div>
                                            <div class="section-behavior">
                                                <p class="behavior-header">Questions</p>
                                                <div class="behavior-content">
                                                    <draggable
                                                        :list="element.questions"
                                                        :disabled="!enabled"
                                                        item-key="name"
                                                        class="list-group"
                                                        ghost-class="ghost"
                                                        :move="checkMove"
                                                    >
                                                        <template #item="{ element }">
                                                            <div
                                                                class="list-group-item"
                                                                :class="{ 'not-draggable': !enabled }"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    :id="'Sharing' + element.sharing_options_id"
                                                                    :checked="element.isChecked"
                                                                    v-model="element.isChecked"
                                                                    :disabled="disableSharingOption"
                                                                />
                                                                <label :for="'Sharing' + element.sharing_options_id">
                                                                    {{ element.question }}
                                                                </label>
                                                            </div>
                                                        </template>
                                                    </draggable>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div v-show="activeStep === 3">
                <survey-builder-gopsi
                    :orgName="orgName"
                    :suborgName="suborgName"
                    :programName="programName"
                    :iterationName="iterationName"
                    :surveyFor="surveyFor"
                    :surveyName="surveyName"
                    :chosenInstruction="chosenInstruction"
                ></survey-builder-gopsi>
                <survey-builder-review
                    :reviewList="reviewList"
                    :chosenLikert="chosenLikert"
                ></survey-builder-review>
            </div>

            <div v-show="activeStep === 4">
                <survey-builder-downloader
                    :surveyData="list"
                    :jsonData="htmlList"
                    :surveyName="surveyName"
                    :prepopulateData="prepopulateList"
                    :participantSurveyId="participantSurveyId"
                    :indId="userData.ind_id"
                ></survey-builder-downloader>
            </div>

            <div v-show="activeStep === 5">
                <div>
                    <p>Reminders before you can start using the survey:</p>
                    <ul>
                        <li>Survey file must be uploaded in the FTP server</li>
                        <li>Associate the survey in the suborg</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="railroad-controls">
            <ButtonSubmit
                id="progress-prev"
                class="btn"
                :disabled="activeStep === 1"
                @click="prevStep"
                label="Previous"
            />
            <ButtonSubmit
                id="progress-next"
                class="btn"
                :disabled="
                    activeStep === steps.length ||
                    !validSurveyName ||
                    surveyName === ''
                "
                @click="nextStep"
                label="Next"
            />
        </div>
    </base-card>
</template>

<script>
import BaseCard from "../UI/BaseCard.vue";
import RailRoad from "../RailRoad.vue";
import BaseDialog from "../../components/UI/BaseDialog.vue";
import DescriptionInline from "../DescriptionInline.vue";
import Header from "../Header.vue";
import ButtonSubmit from "../ButtonSubmit.vue";
import api from "../../api/api.js";
import draggable from "vuedraggable";
import SurveyBuilderGopsi from "./SurveyBuilderGopsi.vue";
import SurveyBuilderReview from "./SurveyBuilderReview.vue";
import SurveyBuilderDownloader from "./SurveyBuilderDownloader.vue";
import FileUploader from "../FileUploader.vue";
import Swal from "sweetalert2";
export default {
    components: {
        BaseCard,
        RailRoad,
        BaseDialog,
        DescriptionInline,
        Header,
        ButtonSubmit,
        draggable,
        FileUploader,
        SurveyBuilderReview,
        SurveyBuilderGopsi,
        SurveyBuilderDownloader,
    },
    props: ["userData", "brandData"],
    data() {
        return {
            steps: [
                { content: "Start" },
                { content: "Setup" },
                { content: "Review" },
                { content: "Download" },
                { content: "Finish" },
            ],
            activeStep: 1,
            selectedSuborgId: 0,
            selectedProgramId: 0,
            selectedIterationId: 0,
            orgName: "",
            suborgName: "",
            programName: "",
            iterationName: "",
            suborgList: [],
            programList: [],
            iterationList: [],
            surveyFor: "1",
            surveyName: "",
            openModal: false,
            enabled: true,
            list: [
                {
                    name: "Competencies",
                    id: "Competencies",
                    isChecked: false,
                    introduction: "",
                    competencyList: [],
                    chosenCompetencyList: [],
                    filteredCompetencyList: [],
                    filteredChosenCompetencyList: [],
                    org_id: null,
                    org_name: null,
                    suborg_id: null,
                    suborg_name: null,
                    program_id: null,
                    program_name: null,
                    iteration_id: null,
                    iteration_name: null,
                    surveyFor: null,
                    surveyName: null,
                    surveyIntro: null,
                    surveyLikert: null,
                },
                {
                    name: "Competency Ranking",
                    id: "CompetencyRanking",
                    isChecked: false,
                    introduction: "",
                    Traits: [],
                    questions: [],
                },
                {
                    name: "Open-ended Questions",
                    id: "OpenEndedQuestions",
                    isChecked: false,
                    introduction: "",
                    questions: [],
                },
                {
                    name: "Organizational Climate",
                    id: "OrganizationalClimate",
                    isChecked: false,
                    introduction: "",
                    questions: [],
                },
                {
                    name: "Collaboration strengths ranking",
                    id: "NetPromoterScore",
                    isChecked: false,
                    introduction: "",
                    questions: [],
                },
                {
                    name: "Report Sharing Options",
                    id: "ReportSharingOptions",
                    isChecked: false,
                    introduction: "",
                    questions: [],
                },
            ],
            dragging: false,
            // modal table data
            table_headers_competency: [
                { colName: "Competency", inputPlaceholder: "" },
                { colName: "Description", inputPlaceholder: "" },
                { colName: "Status", inputPlaceholder: "" },
                { colName: "Source", inputPlaceholder: "" },
                { colName: "Added by", inputPlaceholder: "" },
                { colName: "Dates valid for use", inputPlaceholder: "" },
                { colName: "Participant Level", inputPlaceholder: "" },
                { colName: "Language", inputPlaceholder: "" },
                { colName: "Actions" },
            ],
            competencyList: [],
            filteredCompetencyList: [],
            inputedCompetency: "",
            inputedDescription: "",
            inputedStatus: "",
            inputedSource: "",
            inputedAddedby: "",
            inputedValidDate: "",
            inputedParticipantLevel: "",
            inputedLanguage: "",

            chosenCompetencyList: [],
            filteredChosenCompetencyList: [],
            chosenCompetencyInput: "",
            chosenDescriptionInput: "",
            chosenStatusInput: "",
            chosenSourceInput: "",
            chosenAddedbyInput: "",
            chosenValidDateInput: "",
            chosenParticipantLevelInput: "",
            chosenLanguageInput: "",

            behaviorList: [],
            likertList: [],
            chosenLikert: "",
            instructionList: [],
            chosenInstruction: null,

            reviewList: [],
            htmlList: [],
            prepopulateList: [],
            surveyProcess: null,

            surveyTemplateList: [],
            validSurveyName: true,

            participantSurveyId: null,

            hasDuplicateCompetencyCode: false,
        };
    },
    async created() {
        try {
            const res = await api.get(`/organizations/${this.userData.org_id}`);
            if (res.status === 200) {
                this.orgName = res.data.org_name;
            }
        } catch (error) {
            console.log(error);
        }

        try {
            const res = await api.get(
                `sub-organizations/${this.userData.org_id}`
            );
            this.suborgList = res.data;
            this.suborgList.sort((a, b) =>
                a.suborg_name.toUpperCase() < b.suborg_name.toUpperCase()
                    ? -1
                    : b.suborg_name.toUpperCase() > a.suborg_name.toUpperCase()
                    ? 1
                    : 0
            );
        } catch (error) {
            console.log(error);
        }

        try {
            const res = await api.get("survey-templates/get-version/2");
            this.surveyTemplateList = res.data;
        } catch (error) {
            console.log(error);
        }

        await this.getSectionIntroduction();
    },
    methods: {
        hasDuplicates() {
            const encounteredCodes = {};
                for (const item of this.filteredChosenCompetencyList) {
                if (encounteredCodes[item.competency_code]) {
                    this.hasDuplicateCompetencyCode = true;
                    return; // Exit the loop as soon as a duplicate is found
                }
                encounteredCodes[item.competency_code] = true;
                }
            this.hasDuplicateCompetencyCode = false;
        },
        nextStep() {
            this.hasDuplicates()
            console.log('hasDuplicateCompetencyCode', this.hasDuplicateCompetencyCode)
            if (this.hasDuplicateCompetencyCode) {
                Swal.fire({
                    text: 'Duplicate competency code detected!',
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                });
                return null
             }
            this.activeStep++;
            if (this.activeStep > this.steps.length) {
                this.activeStep = this.steps.length;
            }
            if (this.activeStep === 3) {
                const data = this.list.find((e) => e.name === "Competencies");
                data.org_id = this.userData.org_id;
                data.org_name = this.orgName;
                data.suborg_id = this.selectedSuborgId;
                data.suborg_name = this.suborgName;
                data.program_id = this.selectedProgramId;
                data.program_name = this.programName;
                data.iteration_id = this.selectedIterationId;
                data.iteration_name = this.iterationName;
                data.surveyFor = this.surveyFor;
                data.surveyName = this.surveyName;
                data.surveyIntro = this.chosenInstruction;
                data.surveyLikert = this.chosenLikert;
                data.filteredChosenCompetencyList =
                    this.filteredChosenCompetencyList;
                data.filteredCompetencyList = this.filteredCompetencyList;
                data.competencyList = this.competencyList;
                data.chosenCompetencyList = this.chosenCompetencyList;
                this.populateReviewList();
                console.log("list", this.list);
            }
            if (this.activeStep === 4) {
                this.readyDownload();
            }
        },
        prevStep() {
            this.activeStep--;
            if (this.activeStep < 1) {
                this.activeStep = 1;
            }
        },
        checkMove() {
            console.log(this.list);
        },
        async createSurvey() {
            this.surveyProcess = 2;
            await this.getCompetency();
            await this.getOeq();
            await this.getOrgClimate();
            await this.getSharingOptions();
            await this.getLikertOptions();
            await this.getSurveyInstruction();
            await this.getNetPomoter();
        },
        validateSurveyName() {
            const res = this.surveyTemplateList.some(
                (e) => e.survey_template_name === this.surveyName.trim()
            );
            if (res === false) {
                this.validSurveyName = true;
            } else {
                this.validSurveyName = false;
            }
        },
        async onFileSubmit(file) {
            const reader = new FileReader();

            reader.readAsText(file);

            reader.onload = async () => {
                const jsonData = JSON.parse(reader.result);
                this.onClickButton(jsonData);
                this.list = jsonData;
                this.surveyProcess = 1;

                const data = this.list.find((el) => el.name === "Competencies");
                this.selectedSuborgId = data.suborg_id;
                this.suborgName = data.suborg_name;
                this.selectedProgramId = data.program_id;
                this.programName = data.program_name;
                this.selectedIterationId = data.iteration_id;
                this.iterationName = data.iteration_name;
                this.surveyFor = data.surveyFor;
                this.surveyName = data.surveyName;
                this.chosenInstruction = data.surveyIntro;
                this.chosenLikert = data.surveyLikert;
                this.filteredCompetencyList = data.filteredCompetencyList;
                this.filteredChosenCompetencyList =
                    data.filteredChosenCompetencyList;
                this.competencyList = data.competencyList;
                this.chosenCompetencyList = data.chosenCompetencyList;

                await this.getLikertOptions();
                await this.getSurveyInstruction();
                this.validateSurveyName();
            };
            reader.onerror = () => {};
        },
        async onClickButton(file) {
            this.$emit("clicked", file);
        },
        async getCompetency() {
            try {
                let compObject = this.list.find(
                    (obj) => obj.id === "Competencies"
                );
                compObject.selectedCompetencies = [];
                this.competencyList = [];
                this.filteredCompetencyList = [];
                this.chosenCompetencyList = [];
                this.filteredChosenCompetencyList = [];
                this.behaviorList = [];

                const res = await api.post("360Competency", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                });

                // res.data.forEach((element) => {
                //   this.competencyList.push(element);
                // });
                let compList = res.data.map((obj) => ({
                    ...obj,
                    isChecked: false,
                }));
                this.competencyList = compList;
                this.filteredCompetencyList = this.competencyList;
            } catch (error) {
                console.log(error);
            }

            try {
                let compObject = this.list.find(
                    (obj) => obj.id === "CompetencyRanking"
                );
                compObject.questions = [];

                const res = await api.post("360Behavior", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                    for_participant: this.surveyFor,
                });
                this.behaviorList = res.data;

                for (let behavior of this.behaviorList) {
                    const competencyId = behavior.competency_id;

                    // Find the corresponding competency in competencyList
                    const competency = this.competencyList.find(
                        (c) => c.competency_id === competencyId
                    );

                    if (competency) {
                        // Create a 'behaviors' property if it doesn't exist
                        if (!competency.behaviors) {
                            competency.behaviors = [];
                        }
                        // Push the behavior into the 'behaviors' array of the competency
                        competency.behaviors.push(behavior);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getOeq() {
            try {
                const res = await api.post("360Oeq", {
                    global: 0,
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                    for_participant: this.surveyFor,
                });
                let openEndedObject = this.list.find(
                    (obj) => obj.id === "OpenEndedQuestions"
                );
                let oeqList = res.data.map((obj) => ({
                    ...obj,
                    isChecked: false,
                }));
                openEndedObject.questions = oeqList;
            } catch (error) {
                console.log(error);
            }
        },
        async getOrgClimate() {
            try {
                const res = await api.post("360OrgClimate", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                    for_participant: this.surveyFor,
                });
                let orgClimateObject = this.list.find(
                    (obj) => obj.id === "OrganizationalClimate"
                );
                let orgClimateList = res.data.map((obj) => ({
                    ...obj,
                    isChecked: false,
                }));
                orgClimateObject.questions = orgClimateList;
            } catch (error) {
                console.log(error);
            }
        },
        async getNetPomoter() {
            try {
                const res = await api.post("360NetPromoterScore", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                    for_participant: this.surveyFor,
                });
                let netPomoterObject = this.list.find(
                    (obj) => obj.id === "NetPromoterScore"
                );
                let netPomoterList = res.data.map((obj) => ({
                    ...obj,
                    isChecked: false,
                }));
                netPomoterObject.questions = netPomoterList;
            } catch (error) {
                console.log(error);
            }
        },
        async getSharingOptions() {
            try {
                const res = await api.post("360SharingOptions", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                });
                let sharingOptionObject = this.list.find(
                    (obj) => obj.id === "ReportSharingOptions"
                );
                let sharingOptionList = res.data.map((obj) => ({
                    ...obj,
                    isChecked: false,
                }));
                sharingOptionObject.questions = sharingOptionList;
            } catch (error) {
                console.log(error);
            }
        },
        async getLikertOptions() {
            try {
                const res = await api.get("360Likert", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                });
                this.likertList = res.data;
            } catch (error) {
                console.log(error);
            }
        },
        async getSurveyInstruction() {
            try {
                const res = await api.post("360Instruction", {
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSuborgId,
                    program_id: this.selectedProgramId,
                    iteration_id: this.selectedIterationId,
                });
                this.instructionList = res.data;
            } catch (error) {
                console.log(error);
            }
        },
        async selectSubOrg(e) {
            let selectedSuborgName = e.target.value;
            this.programList = [];
            this.selectedProgramId = 0;
            this.programName = "";
            this.iterationList = [];
            this.selectedIterationId = 0;
            this.iterationName = "";

            for (const data of this.suborgList) {
                if (data.suborg_name === selectedSuborgName) {
                    this.selectedSuborgId = data.suborg_id;
                    this.suborgName = data.suborg_name;
                }
                if (selectedSuborgName === "0") {
                    this.selectedSuborgId = 0;
                    this.suborgName = "";
                }
            }
            try {
                const res = await api.get(
                    `programs/suborg/${this.selectedSuborgId}`
                );
                this.programList = res.data;
                this.programList.sort((a, b) =>
                    a.program_name.toUpperCase() < b.program_name.toUpperCase()
                        ? -1
                        : b.program_name.toUpperCase() >
                          a.program_name.toUpperCase()
                        ? 1
                        : 0
                );
            } catch (error) {
                console.log(error);
            }
            await this.getCompetency();
            await this.getOeq();
            await this.getOrgClimate();
            await this.getSharingOptions();
            await this.getLikertOptions();
            await this.getSurveyInstruction();
            await this.getNetPomoter();
            await this.getSectionIntroduction();
        },
        async selectProgram(e) {
            this.iterationList = [];
            this.selectedIterationId = 0;
            this.iterationName = "";
            let selectedProgramName = e.target.value;
            for (const data of this.programList) {
                if (data.program_name === selectedProgramName) {
                    this.selectedProgramId = data.program_id;
                    this.programName = data.program_name;
                }
                if (selectedProgramName === "0") {
                    this.selectedProgramId = 0;
                }
            }
            try {
                const res = await api.get(
                    `iterations/programs/${this.selectedProgramId}`
                );
                this.iterationList = res.data;
                this.iterationList.sort((a, b) =>
                    a.iteration_name.toUpperCase() <
                    b.iteration_name.toUpperCase()
                        ? -1
                        : b.iteration_name.toUpperCase() >
                          a.iteration_name.toUpperCase()
                        ? 1
                        : 0
                );
            } catch (error) {
                console.log(error);
            }
            await this.getCompetency();
            await this.getOeq();
            await this.getOrgClimate();
            await this.getSharingOptions();
            await this.getLikertOptions();
            await this.getSurveyInstruction();
            await this.getNetPomoter();
            await this.getSectionIntroduction();
        },
        async selectIteration(e) {
            let selectedIterationName = e.target.value;
            for (const data of this.iterationList) {
                if (data.iteration_name === selectedIterationName) {
                    this.selectedIterationId = data.iteration_id;
                    this.iterationName = data.iteration_name;
                }
                if (selectedIterationName === "0") {
                    this.selectedIterationId = 0;
                }
            }
            await this.getCompetency();
            await this.getOeq();
            await this.getOrgClimate();
            await this.getSharingOptions();
            await this.getLikertOptions();
            await this.getSurveyInstruction();
            await this.getNetPomoter();
            await this.getSectionIntroduction();
        },
        async selectSurveyFor(e) {
            let selectedSurveyFor = e.target.value;
            console.log(selectedSurveyFor);
            this.surveyFor = selectedSurveyFor;
            await this.getCompetency();
            await this.getOeq();
            await this.getOrgClimate();
            await this.getNetPomoter();
        },
        selectLikert(e) {
            this.chosenLikert = e.target.value;
        },
        handleModal() {
            this.openModal = !this.openModal;
        },
        filterTable(list) {
            if (list === "chosenCompetencyList") {
                const filteredChosenCompetencies =
                    this.chosenCompetencyList.filter(
                        (competency) =>
                            (this.chosenCompetencyInput === "" ||
                                competency.competency_name
                                    ?.toLowerCase()
                                    .includes(this.chosenCompetencyInput)) &&
                            (this.chosenDescriptionInput === "" ||
                                competency.competency_desc
                                    ?.toLowerCase()
                                    .includes(this.chosenDescriptionInput)) &&
                            (this.chosenStatusInput === "" ||
                                competency.status
                                    ?.toLowerCase()
                                    .includes(this.chosenStatusInput)) &&
                            (this.chosenSourceInput === "" ||
                                competency.source
                                    ?.toLowerCase()
                                    .includes(this.chosenSourceInput)) &&
                            (this.chosenAddedbyInput === "" ||
                                competency.added_by
                                    ?.toLowerCase()
                                    .includes(this.chosenAddedbyInput)) &&
                            (this.chosenValidDateInput === "" ||
                                competency.valid_dates?.includes(
                                    this.chosenValidDateInput
                                )) &&
                            (this.chosenParticipantLevelInput === "" ||
                                competency.participant_level
                                    ?.toLowerCase()
                                    .includes(
                                        this.chosenParticipantLevelInput
                                    )) &&
                            (this.chosenLanguageInput === "" ||
                                competency.language
                                    ?.toLowerCase()
                                    .includes(this.chosenLanguageInput))
                    );
                this.filteredChosenCompetencyList = filteredChosenCompetencies;
            }
            if (list === "competencyList") {
                const filteredCompetencies = this.competencyList.filter(
                    (competency) =>
                        (this.inputedCompetency === "" ||
                            competency.competency_name
                                ?.toLowerCase()
                                .includes(this.inputedCompetency)) &&
                        (this.inputedDescription === "" ||
                            competency.competency_desc
                                ?.toLowerCase()
                                .includes(this.inputedDescription)) &&
                        (this.inputedStatus === "" ||
                            competency.status
                                ?.toLowerCase()
                                .includes(this.inputedStatus)) &&
                        (this.inputedSource === "" ||
                            competency.source
                                ?.toLowerCase()
                                .includes(this.inputedSource)) &&
                        (this.inputedAddedby === "" ||
                            competency.added_by
                                ?.toLowerCase()
                                .includes(this.inputedAddedby)) &&
                        (this.inputedValidDate === "" ||
                            competency.valid_dates?.includes(
                                this.inputedValidDate
                            )) &&
                        (this.inputedParticipantLevel === "" ||
                            competency.participant_level
                                ?.toLowerCase()
                                .includes(this.inputedParticipantLevel)) &&
                        (this.inputedLanguage === "" ||
                            competency.language
                                ?.toLowerCase()
                                .includes(this.inputedLanguage))
                );
                this.filteredCompetencyList = filteredCompetencies;
            }
        },

        addCompetency(compId) {
            const list = this.competencyList.filter(
                (obj) => obj.competency_id !== compId
            );
            const chosenCompetency = this.competencyList.find(
                (obj) => obj.competency_id === compId
            );

            this.competencyList = list;
            this.filteredCompetencyList = list;

            let compObject = this.list.find((obj) => obj.id === "Competencies");
            compObject.selectedCompetencies.push(chosenCompetency);

            this.chosenCompetencyList = compObject.selectedCompetencies;
            this.filteredChosenCompetencyList = this.chosenCompetencyList;

            let rankingObject = this.list.find(
                (obj) => obj.id === "CompetencyRanking"
            );
            // console.log(chosenCompetency);

            let rankingCompetencyList = this.chosenCompetencyList.map((e) => ({
                ...e,
            }));
            rankingObject.questions = rankingCompetencyList;
            console.log('questions', rankingObject.questions)
            rankingObject.Traits = rankingObject.questions.map((question, index) => `CII${index + 1}`);
        },
        removeCompetency(compId) {
            const list = this.chosenCompetencyList.filter(
                (obj) => obj.competency_id !== compId
            );
            const chosenCompetency = this.chosenCompetencyList.find(
                (obj) => obj.competency_id === compId
            );

            let compObject = this.list.find((obj) => obj.id === "Competencies");
            compObject.selectedCompetencies = list;

            this.chosenCompetencyList = list;
            this.filteredChosenCompetencyList = list;

            this.competencyList.push(chosenCompetency);
            this.filteredCompetencyList = this.competencyList;

            let rankingObject = this.list.find(
                (obj) => obj.id === "CompetencyRanking"
            );
            rankingObject.questions = this.chosenCompetencyList;

            // console.log(this.list);
        },
        handleCheck(id) {
            if (id === "Competencies") {
                const obj = this.list.find(
                    (data) => data.id === "Competencies"
                );
                if (obj.isChecked === false) {
                    obj.selectedCompetencies.forEach((res) => {
                        res.isChecked = false;
                        res.behaviors.forEach((res) => {
                            res.isChecked = false;
                        });
                    });
                }
            }
            if (id === "CompetencyRanking") {
                const obj = this.list.find(
                    (data) => data.id === "CompetencyRanking"
                );
                if (obj.isChecked === false) {
                    obj.questions.forEach((res) => {
                        res.isChecked = false;
                    });
                }
            }
            if (id === "OpenEndedQuestions") {
                const obj = this.list.find(
                    (data) => data.id === "OpenEndedQuestions"
                );
                if (obj.isChecked === false) {
                    obj.questions.forEach((res) => {
                        res.isChecked = false;
                    });
                }
            }
            if (id === "OrganizationalClimate") {
                const obj = this.list.find(
                    (data) => data.id === "OrganizationalClimate"
                );
                if (obj.isChecked === false) {
                    obj.questions.forEach((res) => {
                        res.isChecked = false;
                    });
                }
            }
            if (id === "ReportSharingOptions") {
                const obj = this.list.find(
                    (data) => data.id === "ReportSharingOptions"
                );
                if (obj.isChecked === false) {
                    obj.questions.forEach((res) => {
                        res.isChecked = false;
                    });
                }
            }
        },
        handleCompetency(competency) {
            // const sectionId = section.id;
            if (competency.isChecked === false) {
                competency.behaviors.forEach((data) => {
                    data.isChecked = false;
                });
            }
        },
        populateReviewList() {
            this.reviewList = [];

            this.list.forEach((res) => {
                if (res.name === "Competencies") {
                    // Filter out competencies with isChecked: false
                    const competenciesSection = this.list.find(
                        (section) => section.name === "Competencies"
                    );
                    if (competenciesSection) {
                        const filteredCompetencies =
                            competenciesSection.selectedCompetencies
                                .filter((competency) => competency.isChecked)
                                .filter(
                                    (competency) =>
                                        competency.behaviors.length > 0
                                );

                        if (filteredCompetencies.length > 0) {
                            this.reviewList.push({
                                name: competenciesSection.name,
                                id: competenciesSection.id,
                                isChecked: competenciesSection.isChecked,
                                introduction: competenciesSection.introduction,
                                selectedCompetencies: filteredCompetencies,
                            });
                        }
                    }
                }
                if (res.name === "Competency Ranking") {
                    // Filter out Competency Ranking with isChecked: false
                    const competencyRanking = this.list.find(
                        (section) => section.name === "Competency Ranking"
                    );
                    const rankingIsChecked = competencyRanking.isChecked;
                    if (rankingIsChecked) {
                        const filteredQuestions =
                            competencyRanking.questions.filter(
                                (question) => question.isChecked
                            );
                        if (filteredQuestions.length > 0) {
                            this.reviewList.push({
                                name: competencyRanking.name,
                                id: competencyRanking.id,
                                isChecked: competencyRanking.isChecked,
                                introduction: competencyRanking.introduction,
                                questions: filteredQuestions,
                            });
                        }
                    }
                }
                if (res.name === "Open-ended Questions") {
                    // Filter out open-ended questions with isChecked: false
                    const openEndedSection = this.list.find(
                        (section) => section.name === "Open-ended Questions"
                    );
                    if (openEndedSection) {
                        const filteredQuestions =
                            openEndedSection.questions.filter(
                                (question) => question.isChecked
                            );
                        if (filteredQuestions.length > 0) {
                            this.reviewList.push({
                                name: openEndedSection.name,
                                id: openEndedSection.id,
                                isChecked: openEndedSection.isChecked,
                                introduction: openEndedSection.introduction,
                                questions: filteredQuestions,
                            });
                        }
                    }
                }
                if (res.name === "Organizational Climate") {
                    // Filter out organizational climate questions with isChecked: false
                    const orgClimateSection = this.list.find(
                        (section) => section.name === "Organizational Climate"
                    );
                    if (orgClimateSection) {
                        const filteredQuestions =
                            orgClimateSection.questions.filter(
                                (question) => question.isChecked
                            );
                        if (filteredQuestions.length > 0) {
                            this.reviewList.push({
                                name: orgClimateSection.name,
                                id: orgClimateSection.id,
                                isChecked: orgClimateSection.isChecked,
                                introduction: orgClimateSection.introduction,
                                questions: filteredQuestions,
                            });
                        }
                    }
                }
                if (res.name === "Collaboration strengths ranking") {
                    // Filter out Collaboration strengths ranking questions with isChecked: false
                    const netPromoterSection = this.list.find(
                        (section) =>
                            section.name === "Collaboration strengths ranking"
                    );
                    if (netPromoterSection) {
                        const filteredQuestions =
                            netPromoterSection.questions.filter(
                                (question) => question.isChecked
                            );
                        if (filteredQuestions.length > 0) {
                            this.reviewList.push({
                                name: netPromoterSection.name,
                                id: netPromoterSection.id,
                                isChecked: netPromoterSection.isChecked,
                                introduction: netPromoterSection.introduction,
                                questions: filteredQuestions,
                            });
                        }
                    }
                }
                if (res.name === "Report Sharing Options") {
                    // Filter out Report Sharing Options questions with isChecked: false
                    const reportSharingOptions = this.list.find(
                        (section) => section.name === "Report Sharing Options"
                    );
                    if (reportSharingOptions) {
                        const filteredQuestions =
                            reportSharingOptions.questions.filter(
                                (question) => question.isChecked
                            );
                        if (filteredQuestions.length > 0) {
                            this.reviewList.push({
                                name: reportSharingOptions.name,
                                id: reportSharingOptions.id,
                                isChecked: reportSharingOptions.isChecked,
                                introduction: reportSharingOptions.introduction,
                                questions: filteredQuestions,
                            });
                        }
                    }
                }
            });
            //jhun dito
            console.log("REVIEW LIST", this.reviewList);

                  // Find the section with the name "Collaboration strengths ranking" in both JSONs
                  const listCollaborationSectionIndex = this.list.findIndex(
                        (section) => section.name === "Collaboration strengths ranking"
                    );

                    const newCollaborationSectionIndex = this.reviewList.findIndex(
                        (section) => section.name === "Collaboration strengths ranking"
                    );

                    // If both sections are found, update the questions and populate nps_code
                if (listCollaborationSectionIndex !== -1 && newCollaborationSectionIndex !== -1) {
                    const listCollaborationQuestions = this.list[listCollaborationSectionIndex].questions;
                    const newCollaborationQuestions = this.reviewList[newCollaborationSectionIndex].questions;

                    // Update the questions in list with those from reviewList
                    this.list[listCollaborationSectionIndex].questions = newCollaborationQuestions;

                    // Populate the nps_code based on the index of the questions
                    listCollaborationQuestions.forEach((question, index) => {
                    question.nps_code = `NPS${index + 1}`;
                    });
                }
            console.log(this.list)
        },

        readyDownload() {
            let CompetenciesList = [];
            let CompRankingList = [];
            let OpenEndedList = [];
            let OrgClimateList = [];
            let NetPromoterList = [];

            let calc = [];
            let calcQueastionNumber = 1;

            this.reviewList.forEach((res) => {
                if (res.isChecked === true) {
                    if (res.name === "Competencies") {
                        res.selectedCompetencies.forEach((element) => {
                            const competencyData = {
                                Name: element.competency_name,
                                Code: element.competency_code,
                                Behaviors: [],
                            };
                            element.behaviors.forEach((el) => {
                                const behaviorData = {
                                    Code: el.behavior_code,
                                    QuestionNumber: `Q${calcQueastionNumber}`,
                                };
                                calcQueastionNumber++;
                                competencyData.Behaviors.push(behaviorData);
                            });
                            CompetenciesList.push(competencyData);
                        });
                    }
                    // d2 jhun
                    if (res.name === "Competency Ranking") {
                        let competencyRankingNumber = 1;

                        res.questions.forEach(() => {
                            const compRankingData = {
                                Code: `CII${competencyRankingNumber}`,
                                QuestionNumber: `Q${calcQueastionNumber}`,
                            };
                            competencyRankingNumber++;
                            calcQueastionNumber++;
                            CompRankingList.push(compRankingData);
                        });
                    }
                    if (res.name === "Open-ended Questions") {
                        let openEndedNumber = 1;
                        res.questions.forEach(() => {
                            const openEndedData = {
                                Code: `OEQ${openEndedNumber}`,
                                QuestionNumber: `Q${calcQueastionNumber}`,
                            };
                            openEndedNumber++;
                            calcQueastionNumber++;
                            OpenEndedList.push(openEndedData);
                        });
                    }
                    if (res.name === "Organizational Climate") {
                        res.questions.forEach((el) => {
                            const orgClimateData = {
                                Code: el.org_climate_code,
                                QuestionNumber: `Q${calcQueastionNumber}`,
                            };
                            calcQueastionNumber++;
                            OrgClimateList.push(orgClimateData);
                        });
                    }
                    if (res.name === "Collaboration strengths ranking") {
                        let netPromoterNumber = 1;
                        res.questions.forEach(() => {
                            const netPromoterData = {
                                Code: `NPS${netPromoterNumber}`,
                                QuestionNumber: `Q${calcQueastionNumber}`,
                            };
                            netPromoterNumber++;
                            calcQueastionNumber++;
                            NetPromoterList.push(netPromoterData);
                        });
                    }
                }
            });
            calc = {
                CompetenciesList,
                CompRankingList,
                OpenEndedList,
                OrgClimateList,
                NetPromoterList,
            };

            // replace textarea line break with BR

            const surveyIntroduction = this.chosenInstruction.replace(
                /\n/g,
                "<br>"
            );
            // generate json for survey
            this.htmlList = [];
            let questionNumber = 1;

            // generate json for prepopulate
            this.prepopulateList = [];
            let prepopulateNumber = 1;

            this.htmlList.push({
                Type: "Heading text",
                QuestionNumber: "",
                Text: this.surveyName,
                Template: "Heading-text",
                Tag: "",
            });
            this.htmlList.push({
                Type: "Description text",
                QuestionNumber: "",
                Text: surveyIntroduction,
                Template: "Description-text",
                Tag: "",
            });

            this.reviewList.forEach((res1) => {
                if (res1.isChecked === true) {
                    const HeadingData = {
                        Type: "Heading text",
                        QuestionNumber: "",
                        Text: res1.name,
                        Template: "Heading-text",
                        Tag: "",
                    };
                    const DescriptionData = {
                        Type: "Description text",
                        QuestionNumber: "",
                        Text: res1.introduction,
                        Template: "Description-text",
                        Tag: "",
                    };

                    if (res1.name === "Competencies") {
                        res1.selectedCompetencies.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const res2HeadingData = {
                                    Type: "Heading text",
                                    QuestionNumber: "",
                                    Text: res2.competency_name,
                                    Template: "Heading-text",
                                    Tag: "",
                                };
                                const res2DescriptionData = {
                                    Type: "Description text",
                                    QuestionNumber: "",
                                    Text: res2.competency_desc,
                                    Template: "Description-text",
                                    Tag: "",
                                };

                                this.htmlList.push(res2HeadingData);
                                this.htmlList.push(res2DescriptionData);

                                res2.behaviors.forEach((res3) => {
                                    const res3Data = {
                                        Type: "Question",
                                        QuestionNumber: questionNumber,
                                        Text: res3.behavior_desc,
                                        Template: this.chosenLikert,
                                        Tag: "",
                                    };
                                    questionNumber++;
                                    this.htmlList.push(res3Data);

                                    //prepopulate
                                    this.prepopulateList.push({
                                        RecordType: "Statement",
                                        RecordId: 1,
                                        StatementNum: `Q${prepopulateNumber}`,
                                        Answer: "",
                                        Score: null,
                                    });
                                    prepopulateNumber++;
                                });
                            }
                        });
                    }
                    if (res1.name === "Open-ended Questions") {
                        this.htmlList.push(HeadingData);
                        this.htmlList.push(DescriptionData);
                        res1.questions.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const questionData = {
                                    Type: "Question",
                                    QuestionNumber: questionNumber,
                                    Text: res2.question,
                                    Template: "Free-text",
                                    Tag: "",
                                };
                                questionNumber++;
                                this.htmlList.push(questionData);

                                //prepopulate
                                this.prepopulateList.push({
                                    RecordType: "Statement",
                                    RecordId: 1,
                                    StatementNum: `Q${prepopulateNumber}`,
                                    Answer: "",
                                    Score: null,
                                });
                                prepopulateNumber++;
                            }
                        });
                    }
                    if (res1.name === "Competency Ranking") {
                        this.htmlList.push(HeadingData);
                        this.htmlList.push(DescriptionData);
                        res1.questions.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const questionData = {
                                    Type: "Question",
                                    QuestionNumber: questionNumber,
                                    Text: `${res2.competency_name} - ${res2.cii_desc}`,
                                    Template: "Re-order",
                                    Tag: "",
                                };
                                questionNumber++;
                                this.htmlList.push(questionData);

                                //prepopulate
                                this.prepopulateList.push({
                                    RecordType: "Ranking",
                                    RecordId: 1,
                                    StatementNum: `Q${prepopulateNumber}`,
                                    Answer: "",
                                    Score: null,
                                });
                                prepopulateNumber++;
                            }
                        });
                    }
                    if (res1.name === "Organizational Climate") {
                        this.htmlList.push(HeadingData);
                        this.htmlList.push(DescriptionData);
                        res1.questions.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const questionData = {
                                    Type: "Question",
                                    QuestionNumber: questionNumber,
                                    Text: res2.question,
                                    Template: "LMC-Agreement-6",
                                    Tag: "",
                                };
                                questionNumber++;
                                this.htmlList.push(questionData);

                                //prepopulate
                                this.prepopulateList.push({
                                    RecordType: "Statement",
                                    RecordId: 1,
                                    StatementNum: `Q${prepopulateNumber}`,
                                    Answer: "",
                                    Score: null,
                                });
                                prepopulateNumber++;
                            }
                        });
                    }
                    if (res1.name === "Collaboration strengths ranking") {
                        this.htmlList.push(HeadingData);
                        this.htmlList.push(DescriptionData);
                        res1.questions.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const questionData = {
                                    Type: "Question",
                                    QuestionNumber: questionNumber,
                                    Text: {
                                        Question: res2.nps_question,
                                        LeftText: res2.nps_left,
                                        RightText: res2.nps_right,
                                    },
                                    Template: "LMC-Net-Promoter-Score",
                                    Tag: "",
                                };
                                questionNumber++;
                                this.htmlList.push(questionData);

                                //prepopulate
                                this.prepopulateList.push({
                                    RecordType: "Statement",
                                    RecordId: 1,
                                    StatementNum: `Q${prepopulateNumber}`,
                                    Answer: "",
                                    Score: null,
                                });
                                prepopulateNumber++;
                            }
                        });
                    }
                    if (res1.name === "Report Sharing Options") {
                        this.htmlList.push(HeadingData);
                        this.htmlList.push(DescriptionData);
                        res1.questions.forEach((res2) => {
                            if (res2.isChecked === true) {
                                const questionData = {
                                    Type: "TagDisplay",
                                    QuestionNumber: questionNumber,
                                    Text: res2.question,
                                    Template: "TagDisplay",
                                    Tag: `${res2.tag_id}`,
                                };
                                questionNumber++;
                                this.htmlList.push(questionData);

                                //prepopulate
                                this.prepopulateList.push({
                                    RecordType: "Statement",
                                    RecordId: 1,
                                    StatementNum: `Q${prepopulateNumber}`,
                                    Answer: "No",
                                    Score: 0,
                                });
                                prepopulateNumber++;
                            }
                        });
                    }
                }
            });

            this.htmlList.push({
                Type: "Calc",
                QuestionNumber: "",
                Text: calc,
                Template: "Calc",
                Tag: "",
            });

            console.log("CALC", calc);
            console.log("HTML LIST", this.htmlList);
            console.log("Prepopulate", this.prepopulateList);
        },
        selectParticipantSurvey(e) {
            this.participantSurveyId = e.target.value;
            console.log(this.participantSurveyId);
        },
        async getSectionIntroduction() {
            try {
                const res = await api.get(
                    `get-360section/${this.userData.org_id}/${this.selectedSuborgId}/${this.selectedProgramId}/${this.selectedIterationId}`
                );
                if (res.status === 200 && res.data.length > 0) {
                    const ranking = res.data.find(
                        (e) => e.section_name === "Competency Ranking"
                    );
                    const rankingtObj = this.list.find(
                        (e) => e.name === "Competency Ranking"
                    );
                    const openEnded = res.data.find(
                        (e) => e.section_name === "Open-ended Questions"
                    );
                    const openEndedObj = this.list.find(
                        (e) => e.name === "Open-ended Questions"
                    );
                    const orgClimate = res.data.find(
                        (e) => e.section_name === "Organizational Climate"
                    );
                    const orgClimateObj = this.list.find(
                        (e) => e.name === "Organizational Climate"
                    );
                    const netPromoter = res.data.find(
                        (e) =>
                            e.section_name === "Collaboration strengths ranking"
                    );
                    const netPromoterObj = this.list.find(
                        (e) => e.name === "Collaboration strengths ranking"
                    );
                    const sharing = res.data.find(
                        (e) => e.section_name === "Report Sharing Options"
                    );
                    const sharingObj = this.list.find(
                        (e) => e.name === "Report Sharing Options"
                    );
                    rankingtObj.introduction = ranking.section_description;
                    openEndedObj.introduction = openEnded.section_description;
                    orgClimateObj.introduction = orgClimate.section_description;
                    netPromoterObj.introduction =
                        netPromoter.section_description;
                    sharingObj.introduction = sharing.section_description;
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    computed: {
        progressWidth() {
            return (
                ((this.activeStep - 1) / (this.steps.length - 1)) * 100 + "%"
            );
        },
        disableCompetency() {
            const obj = this.list.find((res) => res.id === "Competencies");
            return !obj.isChecked;
        },
        disableOpenended() {
            const obj = this.list.find(
                (res) => res.id === "OpenEndedQuestions"
            );
            return !obj.isChecked;
        },
        disableOrgClimate() {
            const obj = this.list.find(
                (res) => res.id === "OrganizationalClimate"
            );
            return !obj.isChecked;
        },
        disableNetPromoter() {
            const obj = this.list.find((res) => res.id === "NetPromoterScore");
            return !obj.isChecked;
        },
        disableSharingOption() {
            const obj = this.list.find(
                (res) => res.id === "ReportSharingOptions"
            );
            return !obj.isChecked;
        },
    },
};
</script>

<style scoped>
.railroad-controls {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 10px 0;
}
.main-content {
    margin: 0px 30px;
    padding: 0px 30px 40px;
}
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
.handle {
    float: left;
    padding: 15px 10px 0 10px;
    color: rgb(244, 120, 32);
}
.question-set-input {
    float: left;
    margin: 17px 10px;
}
.textOnInput {
    margin: 15px 0;
}
.formControl {
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border-width: 0 0 1px;
    border-color: grey;
    padding: 2px 5px;
    /* margin-bottom: 1em; */
    outline: 0;
    width: -webkit-fill-available;
}
.accordion-input {
    position: absolute;
    opacity: 0;
    z-index: -1;
}
/* Accordion styles */
.tabs {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px -4px #000;
    margin: 10px 0px;
}
.tab {
    width: 100%;
    color: white;
    overflow: hidden;
}
.tab-label {
    display: flex;
    justify-content: space-between;
    padding: 1em;
    background: #f7f7f7;
    font-weight: bold;
    cursor: pointer;
    margin: 0px;
    color: rgb(0, 0, 0);
    /* Icon */
}
.tab-label:hover {
    background: #c5c5c5;
}
.tab-label::after {
    content: "\276F";
    width: 1em;
    height: 1em;
    text-align: center;
    transition: all 0.2s;
}
.tab-content {
    max-height: 0px;
    padding: 0 1em;
    color: #2c3e50;
    background: white;
    transition: all 0.2s;
}
.tab-close {
    display: flex;
    justify-content: flex-end;
    padding: 1em;
    font-size: 0.75em;
    background: #f5f5f5;
    cursor: pointer;
}
.tab-close:hover {
    background: #f7f7f7;
}
.accordion-input:checked + .tab-label {
    background: #c4c8cb;
}
.accordion-input:checked + .tab-label::after {
    transform: rotate(90deg);
}
.accordion-input:checked ~ .tab-content {
    max-height: 100vh;
    padding: 1em;
    overflow: auto;
}
p {
    margin: 0;
}
.intro-header,
.behavior-header {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
}
.intro-content,
.behavior-content {
    font-size: 14px;
    padding: 10px;
}
#table {
    width: 100%;
    table-layout: auto;
    border-collapse: collapse;
    border: 1px solid black;
}

#table td,
#table th {
    border: 1px solid #ddd;
    padding: 8px;
    /* word-break: word-wrap; */
}

#table tr:nth-child(even) {
    background-color: #f2f2f2;
}

#table tr:hover {
    background-color: #ddd;
}

#table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    color: black;
    /* text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; */
    font-weight: 100;
}

#table td {
    text-align: left;
    vertical-align: middle;
    font-size: small;
}
#table td input {
    width: 100%;
    box-sizing: border-box; /* include padding and border in width */
}
.invalid {
    color: red;
}
.oeq_details{
    font-weight: bold;
}
/* .oeq-item{
    margin: 10px 0px;
} */
.oeq-text{
    padding: 1em;
    margin: 0;
}
.section-behavior{
    overflow-y: auto;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>