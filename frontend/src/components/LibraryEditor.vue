<script setup>
import Header from './Header.vue'
import ButtonSubmit from './ButtonSubmit.vue'
import ButtonCancel from './ButtonCancel.vue'
import api from "../api/api";
import draggable from "vuedraggable"
import Swal from "sweetalert2";
</script>

<template>
  <div class="body-form-container">
    <div id="modal" @click="hideModal">
      <div class="modal-content">
        <div class="form-container">
          <div class="add-container" v-if="viewModal">
            <!-- Modal content -->
            <button class="modal-close" @click="hideModal">X</button>
            
            <!-- Display selected competency details -->
              <!-- Global -->
              <div v-if="selectedGlobalCompetency">
                <p>GLOBAL COMPETENCY</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="competency">Competency:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGlobalCompetency.competency_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Description:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGlobalCompetency.competency_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Ranking Desc:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGlobalCompetency.cii_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Code:</label>
                    <select id="competency" name="competency" v-model="selectedGlobalCompetency.competency_code" :disabled="!showSaveButton">
                      <option value="">Select Competency Code</option>
                      <option v-for="(item, index) in CompetencyCodeList" :key="index" :value="item['Competency Code']">
                        {{ item['Competency Code'] }} (Behavior Count = {{ item['Behavior Count'] }})
                      </option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="competency">Source:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedGlobalCompetency.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="competency">Added By:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedGlobalCompetency.added_by" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="date-valid-from">Date Valid From:</label>
                        <input type="datetime-local" id="date-valid-from" name="date_valid_from" :value="formatDateTime(selectedGlobalCompetency.date_valid_from)" @input="selectedGlobalCompetency.date_valid_from = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGlobalCompetency.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGlobalCompetency.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="date-valid-to">Date Valid To:</label>
                        <input type="datetime-local" id="date-valid-to" name="date_valid_to" :value="formatDateTime(selectedGlobalCompetency.date_valid_to)" @input="selectedGlobalCompetency.date_valid_to = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-group" v-if="showEditButton">
                  <div v-for="(behavior, index) in selectedGlobalCompetency.behaviors" :key="behavior.behavior_id">
                    <label :for="'behavior' + (index + 1)">
                      Behavior {{ index + 1 }}:
                    </label>
                    <div class="textarea-container">
                      <textarea
                        :id="'behavior' + (index + 1)"
                        :name="'behavior' + (index + 1)"
                        rows="2"
                        :value="behavior.behavior_desc"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="showSaveButton">
                  <draggable
                    :list="selectedGlobalCompetency.behaviors"
                    :disabled="!enabled"
                    item-key="behavior_id"
                    class="list-group"
                    ghost-class="ghost"
                    :move="checkMove"
                    @start="dragging = true"
                    @end="handleDragEnd"
                  >
                    <template #item="{ element, index }">
                      <div>
                        <label :for="'behavior' + (element.behavior_id + 1)">
                          <i class="fas fa-bars drag-icon"></i>
                          Behavior {{ index + 1 }} / Reversed
                          <input type="checkbox" :id="'reversed' + (element.behavior_id + 1)" :name="'reversed' + (element.behavior_id + 1)" v-model="element.is_reversed" :value="1" :true-value="1" :false-value="0">
                        </label>
                        <div class="textarea-container">
                          <textarea :id="'behavior' + (element.behavior_id + 1)" :name="'behavior' + (element.behavior_id + 1)" rows="2" v-model="element.behavior_desc"></textarea>
                          <button class="remove-btn" @click="removeBehavior(index , element.behavior_id, 'GLOBAL')" v-show="selectedGlobalCompetency.behaviors.length > 1">
                            Remove
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                  <ButtonSubmit
                    label="+ Add Behavior"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                      display: flex;
                      align-items: center;
                    "
                    @click="addBehavior(selectedGlobalCompetency.behaviors ? selectedGlobalCompetency.behaviors.length : '', 'GLOBAL')"
                    >
                  </ButtonSubmit>
                </div>

                <div class="button-container" v-if="userData.roles.split(', ').includes('16')">
                  <ButtonSubmit
                    v-if="showEditButton && !showSaveButton"
                    label="Edit Competency"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                    @click="handleEdit()"
                  />
                  <ButtonSubmit
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Save"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleSave('GLOBAL')"
                  />
                  <ButtonCancel
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Cancel"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleCancel()"
                  />
                </div>
              </div>
              <!-- ORG -->
              <div v-if="selectedOrgCompetency">
                <p>ORG COMPETENCY</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="competency">Competency:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedOrgCompetency.competency_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Description:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedOrgCompetency.competency_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Ranking Desc:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedOrgCompetency.cii_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Code:</label>
                    <select id="competency" name="competency" v-model="selectedOrgCompetency.competency_code" :disabled="!showSaveButton">
                      <option value="">Select Competency Code</option>
                      <option v-for="(item, index) in CompetencyCodeList" :key="index" :value="item['Competency Code']">
                        {{ item['Competency Code'] }} (Behavior Count = {{ item['Behavior Count'] }})
                      </option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="competency">Source:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedOrgCompetency.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="competency">Added By:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedOrgCompetency.added_by" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="date-valid-from">Date Valid From:</label>
                        <input type="datetime-local" id="date-valid-from" name="date_valid_from" :value="formatDateTime(selectedOrgCompetency.date_valid_from)" @input="selectedOrgCompetency.date_valid_from = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedOrgCompetency.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedOrgCompetency.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="date-valid-to">Date Valid To:</label>
                        <input type="datetime-local" id="date-valid-to" name="date_valid_to" :value="formatDateTime(selectedOrgCompetency.date_valid_to)" @input="selectedOrgCompetency.date_valid_to = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-group" v-if="showEditButton">
                  <div v-for="(behavior, index) in selectedOrgCompetency.behaviors" :key="behavior.behavior_id">
                    <label :for="'behavior' + (index + 1)">
                      Behavior {{ index + 1 }}:
                    </label>
                    <div class="textarea-container">
                      <textarea
                        :id="'behavior' + (index + 1)"
                        :name="'behavior' + (index + 1)"
                        rows="2"
                        :value="behavior.behavior_desc"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="showSaveButton">
                  <draggable
                    :list="selectedOrgCompetency.behaviors"
                    :disabled="!enabled"
                    item-key="behavior_id"
                    class="list-group"
                    ghost-class="ghost"
                    :move="checkMove"
                    @start="dragging = true"
                    @end="dragging = false"
                  >
                    <template #item="{ element, index }">
                      <div>
                        <label :for="'behavior' + (element.behavior_id + 1)">
                          <i class="fas fa-bars drag-icon"></i>
                          Behavior {{ index + 1 }} / Reversed
                          <input type="checkbox" :id="'reversed' + (element.behavior_id + 1)" :name="'reversed' + (element.behavior_id + 1)" v-model="element.is_reversed" :value="1" :true-value="1" :false-value="0">
                        </label>
                        <div class="textarea-container">
                          <textarea :id="'behavior' + (element.behavior_id + 1)" :name="'behavior' + (element.behavior_id + 1)" rows="2" v-model="element.behavior_desc"></textarea>
                          <button class="remove-btn" @click="removeBehavior(index , element.behavior_id, 'ORG')" v-show="selectedOrgCompetency.behaviors.length > 1">
                            Remove
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>

                  <ButtonSubmit
                    label="+ Add Behavior"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                      display: flex;
                      align-items: center;
                    "
                    @click="addBehavior(selectedOrgCompetency.behaviors ? selectedOrgCompetency.behaviors.length : '', 'ORG')"
                    >
                  </ButtonSubmit>
                </div>

                <div class="button-container">
                  <ButtonSubmit
                    v-if="showEditButton && !showSaveButton"
                    label="Edit Competency"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                    @click="handleEdit()"
                  />
                  <ButtonSubmit
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Save"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleSave('ORG')"
                  />
                  <ButtonCancel
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Cancel"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleCancel()"
                  />
                </div>
              </div>
              <!-- gospi -->
              <div v-if="selectedGospiCompetency">
                <p>GOSPI COMPETENCY</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="competency">Competency:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGospiCompetency.competency_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Description:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGospiCompetency.competency_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Ranking Desc:</label>
                    <input type="text" id="competency" name="competency" v-model="selectedGospiCompetency.cii_desc" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="competency">Competency Code:</label>
                    <select id="competency" name="competency" v-model="selectedGospiCompetency.competency_code" :disabled="!showSaveButton">
                      <option value="">Select Competency Code</option>
                      <option v-for="(item, index) in CompetencyCodeList" :key="index" :value="item['Competency Code']">
                        {{ item['Competency Code'] }} (Behavior Count = {{ item['Behavior Count'] }})
                      </option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="competency">Source:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedGospiCompetency.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="competency">Added By:</label>
                        <input type="text" id="competency" name="competency" v-model="selectedGospiCompetency.added_by" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="date-valid-from">Date Valid From:</label>
                        <input type="datetime-local" id="date-valid-from" name="date_valid_from" :value="formatDateTime(selectedGospiCompetency.date_valid_from)" @input="selectedGospiCompetency.date_valid_from = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGospiCompetency.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGospiCompetency.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="date-valid-to">Date Valid To:</label>
                        <input type="datetime-local" id="date-valid-to" name="date_valid_to" :value="formatDateTime(selectedGospiCompetency.date_valid_to)" @input="selectedGospiCompetency.date_valid_to = $event.target.value" :disabled="!showSaveButton" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="form-group" v-if="showEditButton">
                  <div v-for="(behavior, index) in selectedGospiCompetency.behaviors" :key="behavior.behavior_id">
                    <label :for="'behavior' + (index + 1)">
                      Behavior {{ index + 1 }}:
                    </label>
                    <div class="textarea-container">
                      <textarea
                        :id="'behavior' + (index + 1)"
                        :name="'behavior' + (index + 1)"
                        rows="2"
                        :value="behavior.behavior_desc"
                        disabled
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div class="form-group" v-if="showSaveButton">
                  <draggable
                    :list="selectedGospiCompetency.behaviors"
                    :disabled="!enabled"
                    item-key="behavior_id"
                    class="list-group"
                    ghost-class="ghost"
                    :move="checkMove"
                    @start="dragging = true"
                    @end="dragging = false"
                  >
                    <template #item="{ element, index }">
                      <div>
                        <label :for="'behavior' + (element.behavior_id + 1)">
                          <i class="fas fa-bars drag-icon"></i>
                          Behavior {{ index + 1 }} / Reversed
                          <input type="checkbox" :id="'reversed' + (element.behavior_id + 1)" :name="'reversed' + (element.behavior_id + 1)" v-model="element.is_reversed" :value="1" :true-value="1" :false-value="0">
                        </label>
                        <div class="textarea-container">
                          <textarea :id="'behavior' + (element.behavior_id + 1)" :name="'behavior' + (element.behavior_id + 1)" rows="2" v-model="element.behavior_desc"></textarea>
                          <button class="remove-btn" @click="removeBehavior(index , element.behavior_id, 'GOSPI')" v-show="selectedGospiCompetency.behaviors.length > 1">
                            Remove
                            <i class="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>

                  <ButtonSubmit
                    label="+ Add Behavior"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                      display: flex;
                      align-items: center;
                    "
                    @click="addBehavior(selectedGospiCompetency.behaviors ? selectedGospiCompetency.behaviors.length : '', 'GOSPI')"
                    >
                  </ButtonSubmit>
                </div>

                <div class="button-container">
                  <ButtonSubmit
                    v-if="showEditButton && !showSaveButton"
                    label="Edit Competency"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                    @click="handleEdit()"
                  />
                  <ButtonSubmit
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Save"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleSave('GOSPI')"
                  />
                  <ButtonCancel
                  v-if="showSaveButton && !isButtonDisabled"
                  label="Cancel"
                  style="
                    padding: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 10px;
                    border-radius: 5px;
                    margin-top: 10px;
                    margin-right: 15px;
                    box-shadow: rgb(204, 204, 204) 2px 4px;
                    text-align: left;
                  "
                    @click="handleCancel()"
                  />
                </div>
              </div>
            <!-- Display selected open-ended details -->
              <!-- global -->
              <div v-if="selectedGlobalOpenEnded">
                <p>GLOBAL OPEN-ENDED</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGlobalOpenEnded.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGlobalOpenEnded.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGlobalOpenEnded.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGlobalOpenEnded.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGlobalOpenEnded.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Open-Ended"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GLOBAL-OEQ')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- org -->
              <div v-if="selectedOrgOpenEnded">
                <p>ORG OPEN-ENDED</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedOrgOpenEnded.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedOrgOpenEnded.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedOrgOpenEnded.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedOrgOpenEnded.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedOrgOpenEnded.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Open-Ended"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('ORG-OEQ')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- gospi -->
              <div v-if="selectedGospiOpenEnded">
                <p>SELECTED LIBRARY OPEN-ENDED</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGospiOpenEnded.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGospiOpenEnded.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGospiOpenEnded.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGospiOpenEnded.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGospiOpenEnded.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Open-Ended"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                    @click="handleSave('GOSPI-OEQ')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
            <!-- Display selected org-climate details -->
              <!-- global -->
              <div v-if="selectedGlobalOrgClimate">
                <p>GLOBAL ORG CLIMATE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="supertrait">Select Supertrait:</label>
                    <select class="select-library" v-model="selectedGlobalOrgClimate.org_climate_code" name="supertrait" required :disabled="!showSaveButton">
                      <option v-for="item in orgclimateSupertraits" :key="item.supertraitCode" :value="item.supertraitCode">{{ item.superTrait }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGlobalOrgClimate.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGlobalOrgClimate.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGlobalOrgClimate.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGlobalOrgClimate.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGlobalOrgClimate.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Org-Climate"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GLOBAL-ORGCLIMATE')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- org -->
              <div v-if="selectedOrgOrgClimate">
                <p>ORG LIBRARY ORG CLIMATE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="supertrait">Select Supertrait:</label>
                    <select class="select-library" v-model="selectedOrgOrgClimate.org_climate_code" name="supertrait" required :disabled="!showSaveButton">
                      <option v-for="item in orgclimateSupertraits" :key="item.supertraitCode" :value="item.supertraitCode">{{ item.superTrait }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedOrgOrgClimate.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedOrgOrgClimate.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedOrgOrgClimate.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedOrgOrgClimate.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedOrgOrgClimate.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Org-Climate"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('ORG-ORGCLIMATE')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- gospi -->
              <div v-if="selectedGospiOrgClimate">
                <p>SELECTED LIBRARY ORG CLIMATE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="supertrait">Select Supertrait:</label>
                    <select class="select-library" v-model="selectedGospiOrgClimate.org_climate_code" name="supertrait" required :disabled="!showSaveButton">
                      <option v-for="item in orgclimateSupertraits" :key="item.supertraitCode" :value="item.supertraitCode">{{ item.superTrait }}</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGospiOrgClimate.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGospiOrgClimate.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGospiOrgClimate.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGospiOrgClimate.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGospiOrgClimate.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Org-Climate"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GOSPI-ORGCLIMATE')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
            <!-- Display selected net promoter score details -->
              <!-- global -->
              <div v-if="selectedGlobalNetPromoterScore">
                <p>GLOBAL NET PROMOTER SCORE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="nps_name">Name:</label>
                    <input type="text" id="nps_name" name="nps_name" v-model="selectedGlobalNetPromoterScore.nps_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_question">Question:</label>
                    <input type="text" id="nps_question" name="nps_question" v-model="selectedGlobalNetPromoterScore.nps_question" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_left">Left Text:</label>
                    <input type="text" id="nps_left" name="nps_left" v-model="selectedGlobalNetPromoterScore.nps_left" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_right">Right Text:</label>
                    <input type="text" id="nps_right" name="nps_right" v-model="selectedGlobalNetPromoterScore.nps_right" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_description">Description:</label>
                    <input type="text" id="nps_description" name="nps_description" v-model="selectedGlobalNetPromoterScore.nps_description" :disabled="!showSaveButton" />
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGlobalNetPromoterScore.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGlobalNetPromoterScore.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGlobalNetPromoterScore.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGlobalNetPromoterScore.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Net Promoter Score"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GLOBAL-NETPROMOTERSCORE')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- org -->
              <div v-if="selectedOrgNetPromoterScore">
                <p>ORG NET PROMOTER SCORE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="nps_name">Name:</label>
                    <input type="text" id="nps_name" name="nps_name" v-model="selectedOrgNetPromoterScore.nps_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_question">Question:</label>
                    <input type="text" id="nps_question" name="nps_question" v-model="selectedOrgNetPromoterScore.nps_question" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_left">Left Text:</label>
                    <input type="text" id="nps_left" name="nps_left" v-model="selectedOrgNetPromoterScore.nps_left" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_right">Right Text:</label>
                    <input type="text" id="nps_right" name="nps_right" v-model="selectedOrgNetPromoterScore.nps_right" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_description">Description:</label>
                    <input type="text" id="nps_description" name="nps_description" v-model="selectedOrgNetPromoterScore.nps_description" :disabled="!showSaveButton" />
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedOrgNetPromoterScore.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedOrgNetPromoterScore.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedOrgNetPromoterScore.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedOrgNetPromoterScore.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Net Promoter Score"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('ORG-SHARINGOPTIONS')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
              <!-- gospi -->
              <div v-if="selectedGospiNetPromoterScore">
                <p>SELECTED NET PROMOTER SCORE</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="nps_name">Name:</label>
                    <input type="text" id="nps_name" name="nps_name" v-model="selectedGospiNetPromoterScore.nps_name" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_question">Question:</label>
                    <input type="text" id="nps_question" name="nps_question" v-model="selectedGospiNetPromoterScore.nps_question" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_left">Left Text:</label>
                    <input type="text" id="nps_left" name="nps_left" v-model="selectedGospiNetPromoterScore.nps_left" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_right">Right Text:</label>
                    <input type="text" id="nps_right" name="nps_right" v-model="selectedGospiNetPromoterScore.nps_right" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_description">Description:</label>
                    <input type="text" id="nps_description" name="nps_description" v-model="selectedGospiNetPromoterScore.nps_description" :disabled="!showSaveButton" />
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <select id="participant-level" name="participant-level" v-model="selectedGospiNetPromoterScore.participant_level" :disabled="!showSaveButton">
                          <option v-for="option in ParticipantLevelOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGospiNetPromoterScore.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGospiNetPromoterScore.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGospiNetPromoterScore.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Net Promoter Score"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GOSPI-NETPROMOTERSCORE')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
            <!-- Display selected sharing-options details -->
            <!-- global -->
              <div v-if="selectedGlobalSharingOptions">
                <p>GLOBAL SHARING OPTIONS</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGlobalSharingOptions.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="question-type">Question Type:</label>
                    <select id="question-type" name="question-type" v-model="selectedGlobalSharingOptions.tag_id" :disabled="!showSaveButton">
                      <option v-for="option in sharingOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGlobalSharingOptions.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGlobalSharingOptions.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGlobalSharingOptions.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Sharing Options"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GLOBAL-SHARINGOPTIONS')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
            <!-- org -->
              <div v-if="selectedOrgSharingOptions">
                <p>ORG SHARING OPTIONS</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedOrgSharingOptions.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="question-type">Question Type:</label>
                    <select id="question-type" name="question-type" v-model="selectedOrgSharingOptions.tag_id" :disabled="!showSaveButton">
                      <option v-for="option in sharingOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedOrgSharingOptions.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedOrgSharingOptions.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedOrgSharingOptions.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Sharing Options"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('ORG-SHARINGOPTIONS')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
            <!-- gospi -->
              <div v-if="selectedGospiSharingOptions">
                <p>SELECTED SHARING OPTIONS</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="selectedGospiSharingOptions.question" :disabled="!showSaveButton"></textarea>
                  </div>
                  <div class="form-group">
                    <label for="question-type">Question Type:</label>
                    <select id="question-type" name="question-type" v-model="selectedGospiSharingOptions.tag_id" :disabled="!showSaveButton">
                      <option v-for="option in sharingOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                    </select>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="selectedGospiSharingOptions.added_by" :disabled="!showSaveButton" />
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="selectedGospiSharingOptions.source" :disabled="!showSaveButton" />
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <select id="language" name="language" v-model="selectedGospiSharingOptions.language" :disabled="!showSaveButton">
                          <option v-for="option in languageOptions" :value="option.value" :key="option.value">{{ option.label }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="showEditButton && !showSaveButton"
                      label="Edit Sharing Options"
                      style="padding: 10px; cursor: pointer; font-size: 16px; border-radius: 5px; margin-top: 10px; margin-right: 15px; box-shadow: rgb(204, 204, 204) 2px 4px; text-align: left;"
                      @click="handleEdit()"
                    />
                    <ButtonSubmit
                    v-if="showSaveButton && !isButtonDisabled"
                    label="Save"
                    style="
                      padding: 10px;
                      cursor: pointer;
                      font-size: 16px;
                      padding: 10px;
                      border-radius: 5px;
                      margin-top: 10px;
                      margin-right: 15px;
                      box-shadow: rgb(204, 204, 204) 2px 4px;
                      text-align: left;
                    "
                      @click="handleSave('GOSPI-SHARINGOPTIONS')"
                    />
                    <ButtonCancel
                      v-if="showSaveButton && !isButtonDisabled"
                      label="Cancel"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                        @click="handleCancel()"
                      />
                  </div>
                </div>
              </div>
          </div>
          <div class="add-container" v-if="viewBorrowedModal">
            <button class="modal-close" @click="hideModal">X</button>
            <!-- competency -->
              <div v-if="borrowedGlobalCompetency">
                <p>{{ getGlobalCompetencyBorrowTitle }}</p>
                  <div class="modal-details-container">
                    <div class="container">
                      <div class="column">
                        <div class="form-group">
                          <label for="competency">Competency:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.competency_name" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Source:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.source" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Added By:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.added_by" :disabled="true" />
                        </div>
                      </div>
                      <div class="column">
                        <div class="form-group">
                          <label for="language">Language:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.language" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="participant-level">Participant Level:</label>
                          <input type="text" id="participant-level" name="participant-level" v-model="borrowedGlobalCompetency.participant_level" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Competency Code:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.competency_code" :disabled="true" />
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="competency">Competency Description:</label>
                      <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.competency_desc" :disabled="true" />
                    </div>
                    <div class="form-group">
                      <label for="competency">Competency Ranking Desc:</label>
                      <input type="text" id="competency" name="competency" v-model="borrowedGlobalCompetency.cii_desc" :disabled="true" />
                    </div>
                    <div style="padding: 10px; border: 1px solid grey; margin-bottom: 20px">
                      <label>Behaviors</label>
                      <div class="form-group">
                        <div v-for="(behavior, index) in borrowedGlobalCompetency.behaviors" :key="behavior.behavior_id">
                          <label :for="'behavior' + (index + 1)">
                          </label>
                          <div class="textarea-container">
                            <textarea
                              :id="'behavior' + (index + 1)"
                              :name="'behavior' + (index + 1)"
                              rows="2"
                              :value="behavior.behavior_desc"
                              disabled
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form>
                    <div class="container">
                      <div class="column">
                        <div class="form-group">
                          <label for="date-valid-from">Date Valid From:</label>
                          <input
                            type="datetime-local"
                            id="date-valid-from"
                            name="date_valid_from"
                            :value="formatDateTime(borrowedGlobalCompetency.date_valid_from)"
                            @input="borrowedGlobalCompetency.date_valid_from = $event.target.value"
                            required
                            disabled
                          />
                        </div>
                      </div>
                      <div class="column">
                        <div class="form-group">
                          <label for="date-valid-to">Date Valid To:</label>
                          <input
                            type="datetime-local"
                            id="date-valid-to"
                            name="date_valid_to"
                            :value="formatDateTime(borrowedGlobalCompetency.date_valid_to)"
                            @input="borrowedGlobalCompetency.date_valid_to = $event.target.value"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div class="button-container">
                      <ButtonSubmit
                        v-if="!isButtonDisabled"
                        label="Borrow"
                        type="submit"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                          text-align: left;
                        "
                        @click="handleBorrow('GLOBAL', $event)"
                      />
                    </div>
                  </form>
                  </div>
              </div>
              <div v-if="borrowedOrgCompetency">
                <p>{{ getOrgCompetencyBorrowTitle }}</p>
                  <div class="modal-details-container">
                    <div class="container">
                      <div class="column">
                        <div class="form-group">
                          <label for="competency">Competency:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.competency_name" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Source:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.source" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Added By:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.added_by" :disabled="true" />
                        </div>
                      </div>
                      <div class="column">
                        <div class="form-group">
                          <label for="language">Language:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.language" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="participant-level">Participant Level:</label>
                          <input type="text" id="participant-level" name="participant-level" v-model="borrowedOrgCompetency.participant_level" :disabled="true" />
                        </div>
                        <div class="form-group">
                          <label for="competency">Competency Code:</label>
                          <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.competency_code" :disabled="true" />
                        </div>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="competency">Competency Description:</label>
                      <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.competency_desc" :disabled="true" />
                    </div>
                    <div class="form-group">
                      <label for="competency">Competency Ranking Desc:</label>
                      <input type="text" id="competency" name="competency" v-model="borrowedOrgCompetency.cii_desc" :disabled="true" />
                    </div>
                    <div style="padding: 10px; border: 1px solid grey; margin-bottom: 20px">
                      <label>Behaviors</label>
                      <div class="form-group">
                        <div v-for="(behavior, index) in borrowedOrgCompetency.behaviors" :key="behavior.behavior_id">
                          <label :for="'behavior' + (index + 1)">
                          </label>
                          <div class="textarea-container">
                            <textarea
                              :id="'behavior' + (index + 1)"
                              :name="'behavior' + (index + 1)"
                              rows="2"
                              :value="behavior.behavior_desc"
                              disabled
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                    <form>
                      <div class="container">
                        <div class="column">
                            <div class="form-group">
                              <label for="date-valid-from">Date Valid From:</label>
                              <input type="datetime-local" id="date-valid-from" name="date_valid_from" :value="formatDateTime(borrowedOrgCompetency.date_valid_from)" @input="borrowedOrgCompetency.date_valid_from = $event.target.value" required disabled/>
                            </div>
                        </div>
                        <div class="column">
                            <div class="form-group">
                              <label for="date-valid-to">Date Valid To:</label>
                              <input type="datetime-local" id="date-valid-to" name="date_valid_to" :value="formatDateTime(borrowedOrgCompetency.date_valid_to)" @input="borrowedOrgCompetency.date_valid_to = $event.target.value" required/>
                            </div>
                        </div>
                      </div>
                        <div class="button-container">
                          <ButtonSubmit
                            v-if="!isButtonDisabled"
                            label="Borrow"
                            type="submit"
                            style="
                              padding: 10px;
                              cursor: pointer;
                              font-size: 16px;
                              padding: 10px;
                              border-radius: 5px;
                              margin-top: 10px;
                              margin-right: 15px;
                              box-shadow: rgb(204, 204, 204) 2px 4px;
                              text-align: left;
                            "
                            @click="handleBorrow('ORG', $event)"
                          />
                        </div>
                    </form>
                  </div>
              </div>
            <!-- open-ended -->
              <div v-if="borrowedGlobalOpenEnded">
                <p>{{ getGlobalOpenEndedBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedGlobalOpenEnded.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedGlobalOpenEnded.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedGlobalOpenEnded.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedGlobalOpenEnded.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedGlobalOpenEnded.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('GLOBAL-OEQ', $event)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="borrowedOrgOpenEnded">
                <p>{{ getOrgOpenEndedBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedOrgOpenEnded.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedOrgOpenEnded.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedOrgOpenEnded.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedOrgOpenEnded.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedOrgOpenEnded.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('ORG-OEQ', $event)"
                    />
                  </div>
                </div>
              </div>
            <!-- org-climate -->
              <div v-if="borrowedGlobalOrgClimate">
                <p>{{ getGlobalOrgClimateBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedGlobalOrgClimate.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedGlobalOrgClimate.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedGlobalOrgClimate.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedGlobalOrgClimate.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedGlobalOrgClimate.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('GLOBAL-ORGCLIMATE', $event)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="borrowedOrgOrgClimate">
                <p>{{ getOrgOrgClimateBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedOrgOrgClimate.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedOrgOrgClimate.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedOrgOrgClimate.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedOrgOrgClimate.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedOrgOrgClimate.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('ORG-ORGCLIMATE', $event)"
                    />
                  </div>
                </div>
              </div>
            <!-- net promoter score -->
              <div v-if="borrowedGlobalNetPromoterScore">
                <p>{{ getGlobalNetPromoterScoreBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="nps_name">Name:</label>
                    <input type="text" id="nps_name" name="nps_name" v-model="borrowedGlobalNetPromoterScore.nps_name" disabled />
                  </div>
                  <div class="form-group">
                    <label for="nps_question">Question:</label>
                    <input type="text" id="nps_question" name="nps_question" v-model="borrowedGlobalNetPromoterScore.nps_question" disabled />
                  </div>
                  <div class="form-group">
                    <label for="nps_left">Left Text:</label>
                    <input type="text" id="nps_left" name="nps_left" v-model="borrowedGlobalNetPromoterScore.nps_left" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_right">Right Text:</label>
                    <input type="text" id="nps_right" name="nps_right" v-model="borrowedGlobalNetPromoterScore.nps_right" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_description">Description:</label>
                    <input type="text" id="nps_description" name="nps_description" v-model="borrowedGlobalNetPromoterScore.nps_description" disabled />
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedGlobalNetPromoterScore.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedGlobalNetPromoterScore.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedGlobalNetPromoterScore.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedGlobalNetPromoterScore.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('GLOBAL-NETPROMOTERSCORE', $event)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="borrowedOrgNetPromoterScore">
                <p>{{ getOrgNetPromoterScoreBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="nps_name">Name:</label>
                    <input type="text" id="nps_name" name="nps_name" v-model="borrowedOrgNetPromoterScore.nps_name" disabled />
                  </div>
                  <div class="form-group">
                    <label for="nps_question">Question:</label>
                    <input type="text" id="nps_question" name="nps_question" v-model="borrowedOrgNetPromoterScore.nps_question" disabled />
                  </div>
                  <div class="form-group">
                    <label for="nps_left">Left Text:</label>
                    <input type="text" id="nps_left" name="nps_left" v-model="borrowedOrgNetPromoterScore.nps_left" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_right">Right Text:</label>
                    <input type="text" id="nps_right" name="nps_right" v-model="borrowedOrgNetPromoterScore.nps_right" :disabled="!showSaveButton" />
                  </div>
                  <div class="form-group">
                    <label for="nps_description">Description:</label>
                    <input type="text" id="nps_description" name="nps_description" v-model="borrowedOrgNetPromoterScore.nps_description" disabled />
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="participant-level">Participant Level:</label>
                        <input type="text" id="participant-level" name="participant-level" v-model="borrowedOrgNetPromoterScore.participant_level" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedOrgNetPromoterScore.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedOrgNetPromoterScore.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedOrgNetPromoterScore.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('ORG-NETPROMOTERSCORE', $event)"
                    />
                  </div>
                </div>
              </div>
            <!-- report sharing -->
              <div v-if="borrowedGlobalSharingOptions">
                <p>{{ getGlobalSharingOptionsBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedGlobalSharingOptions.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedGlobalSharingOptions.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedGlobalSharingOptions.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedGlobalSharingOptions.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('GLOBAL-SHARINGOPTIONS', $event)"
                    />
                  </div>
                </div>
              </div>
              <div v-if="borrowedOrgSharingOptions">
                <p>{{ getOrgSharingOptionsBorrowTitle }}</p>
                <div class="modal-details-container">
                  <div class="form-group">
                    <label for="question">Question:</label>
                    <textarea rows="4" id="question" name="question" v-model="borrowedOrgSharingOptions.question" disabled></textarea>
                  </div>
                  <div class="container">
                    <div class="column">
                      <div class="form-group">
                        <label for="added-by">Added By:</label>
                        <input type="text" id="added-by" name="added-by" v-model="borrowedOrgSharingOptions.added_by" disabled/>
                      </div>
                    </div>
                    <div class="column">
                      <div class="form-group">
                        <label for="source">Source:</label>
                        <input type="text" id="source" name="source" v-model="borrowedOrgSharingOptions.source" disabled/>
                      </div>
                      <div class="form-group">
                        <label for="language">Language:</label>
                        <input type="text" id="language" name="language" v-model="borrowedOrgSharingOptions.language" disabled/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="button-container">
                    <ButtonSubmit
                      v-if="!isButtonDisabled"
                      label="Borrow"
                      type="submit"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleBorrow('ORG-SHARINGOPTIONS', $event)"
                    />
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>

    <Header label="Library Editor" style="margin-left: 20px"></Header>
    <div class="control-container">
      <div class="select-library-container">
        <p>Select Library:</p>
        <select name="library" class="select-library" v-model="forParticipant">
          <option value="1">Participant</option>
          <option value="0">Nominee</option>
        </select>
      </div>
      <p>
        Please choose a Sub-Organization competency library you want to
        modify.
      </p>
      <div class="gospi-select-container">
        <div>
          <p>Your Organization is:</p>
          <input
            type="text"
            :value="org"
            disabled
            placeholder="Loading..."
            style="
              font-size: 16px;
              font-weight: bold;
              background-color: white;
              text-align: center;
            "
          />
        </div>
        <div>
          <p>Select Sub-Organization:</p>
          <select name="suborg" class="select-library" v-model="selectedSubOrg">
            <option :value="{ subOrgId: 0, subOrgName: 'No Sub-Org' }">No Sub-Org</option>
            <option v-for="(subOrg, index) in subOrgs" :value="subOrg" :key="index">{{ subOrg.subOrgName }}</option>
          </select>
        </div>
      </div>
      <div class="toggle-wrapper">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <label class="toggle-label" for="toggle-global"
            >Show Global Library</label
          >
          <div class="toggle-global">
            <input
              type="checkbox"
              id="toggle-global"
              v-model="globalContainer"
            />
            <label for="toggle-global" class="toggle-switch"></label>
          </div>
        </div>
        <div style="display: flex; flex-direction: column">
          <label class="toggle-label" for="toggle-org">Show Org Library</label>
          <div class="toggle-org">
            <input type="checkbox" id="toggle-org" v-model="orgContainer" />
            <label for="toggle-org" class="toggle-switch"></label>
          </div>
        </div>
      </div>
      <div>
        <ButtonSubmit
          label="Load Library"
          @click="getLibraryData()"
          style="
            padding: 10px;
            color: white;
            cursor: pointer;
            font-size: 16px;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            margin-right: 15px;
            box-shadow: rgb(204, 204, 204) 2px 4px;
          "
        />
      </div>
    </div>
    <div class="tables-container">
      <!-- global -->
      <transition>
        <div
          class="table-container-global"
          style="background-color: white; padding: 10px; margin-bottom: 30px"
          v-show="globalContainer"
        >
          <h3>Global Library</h3>
          <div>
            <div id="accordion-competency-global" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('Competency')"
              >
                <span>Competency</span>
                <i
                  :class="{
                    'fa-chevron-down': !competencyAccordion,
                    'fa-chevron-up': competencyAccordion,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="competencyAccordion">
                  <div>
                    <div class="section-description">
                    <label>Competency Ranking Description: </label>
                    <textarea type="text" rows="4" v-model="ciiGLOBALSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GLOBAL-CII')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                          >
                            <span>Borrow</span>
                          </th>
                          <th
                            style="background-color: rgba(244, 120, 32, 0.8)"
                            v-for="head in table_headers_competency"
                            :key="head"
                          >
                            <a
                              @click="sortByHeader(head, GLOBALlibraryData.competency)"
                              style="
                                display: flex;
                                flex-direction: row;
                                cursor: pointer;
                              "
                            >
                              {{
                                head == 'competency_name'
                                  ? 'Competency'
                                  : head == 'competency_desc'
                                  ? 'Description'
                                  : head == 'competency_code'
                                  ? 'Code'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'date_valid_from'
                                  ? 'Date Valid From'
                                  : head == 'date_valid_to'
                                  ? 'Date Valid To'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                              type="text"
                              placeholder="Search competency..."
                              style=""
                              v-model="searchGlobalCompetency"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search description..."
                                style=""
                                v-model="searchGlobalCompetencyDesc"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search code..."
                                style=""
                                v-model="searchGlobalCompetencyCode"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGlobalCompetencyStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchGlobalCompetencySource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Added by..."
                                style=""
                                v-model="searchGlobalCompetencyAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchFrom"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidFrom"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchTo"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidTo"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Participant level..."
                                style=""
                                v-model="searchGlobalCompetencyParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalCompetencyLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGLOBALCompetency" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.competency_id, 'GLOBAL')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.competency_id, 'GLOBAL')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.competency_name }}
                          </td>
                          <td>{{ item.competency_desc }}</td>
                          <td>{{ item.competency_code }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ readDate(item.date_valid_from) }}</td>
                          <td>{{ readDate(item.date_valid_to) }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Global Competency"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                      "
                      @click="handleShowAdd('GLOBAL')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-openended-global" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('OpenEnded')"
              >
                <span>Open-Ended</span>
                <i
                  :class="{
                    'fa-chevron-down': !openEndedAccordion,
                    'fa-chevron-up': openEndedAccordion,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="openEndedAccordion">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="oeqGLOBALSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GLOBAL-OEQ')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            class="th-openended-global"
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                          >
                            <span>Borrow</span>
                          </th>
                          <th
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                            v-for="head in table_headers_openended"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, GLOBALlibraryData.openEnded)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchGlobalOeq"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGlobalOeqStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGlobalOeqParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGlobalOeqSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGlobalOeqAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalOeqLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGlobalOeq" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.oeq_id, 'GLOBAL-OEQ')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.oeq_id, 'GLOBAL-OEQ')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container" v-if="userData.roles.split(', ').includes('16')">
                    <ButtonSubmit
                      label="Add New Open-Ended"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GLOBAL-OEQ')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-orgclimate-global" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('OrgClimate')"
              >
                <span>Organizational Climate</span>
                <i
                  :class="{
                    'fa-chevron-down': !orgclimateAccordion,
                    'fa-chevron-up': orgclimateAccordion,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="orgclimateAccordion">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="orgclimateGLOBALSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GLOBAL-ORGCLIMATE')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            class="th-orgclimate-global"
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="background-color: rgba(244, 120, 32, 0.8)"
                            v-for="head in table_headers_orgclimate"
                            :key="head"
                          >
                           <a
                            @click="sortByHeader(head, GLOBALlibraryData.orgClimate)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchGlobalOrgClimate"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGlobalOrgClimate"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGlobalOrgClimateParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGlobalOrgClimateSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGlobalOrgClimateAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalOrgClimateLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGlobalOrgClimate" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.org_climate_id, 'GLOBAL-ORGCLIMATE')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.org_climate_id, 'GLOBAL-ORGCLIMATE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container" v-if="userData.roles.split(', ').includes('16')">
                    <ButtonSubmit
                      label="Add New Global Org-Climate"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GLOBAL-ORGCLIMATE')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-netpromoterscore-global" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('NetPromoterScore')"
              >
                <span>Net Promoter Score</span>
                <i
                  :class="{
                    'fa-chevron-down': !netpromoterScoreAccordion,
                    'fa-chevron-up': netpromoterScoreAccordion,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="netpromoterScoreAccordion">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="npsGLOBALSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GLOBAL-NPS')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            class="th-netpromoterscore-global"
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="background-color: rgba(244, 120, 32, 0.8)"
                            v-for="head in table_headers_netpromoterscore"
                            :key="head"
                          >
                           <a
                            @click="sortByHeader(head, GLOBALlibraryData.netpromoterScore)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'nps_name'
                                  ? 'Name'
                                  : head == 'nps_description'
                                  ? 'Description'
                                  : head == 'nps_question'
                                  ? 'Question'
                                  : head == 'nps_left'
                                  ? 'Left Text'
                                  : head == 'nps_right'
                                  ? 'Right Text'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search name..."
                                style=""
                                v-model="searchGlobalNetPromoterScore"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search description..."
                                style="min-width: 10px"
                                v-model="searchGlobalNetPromoterScoreDescription"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search question..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreQuestion"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search left..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreLeft"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search right..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreRight"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalNetPromoterScoreLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGlobalNetPromoterScore" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.nps_id, 'GLOBAL-NETPROMOTERSCORE')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.nps_id, 'GLOBAL-NETPROMOTERSCORE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.nps_name }}
                          </td>
                          <td>{{ item.nps_description }}</td>
                          <td>{{ item.nps_question }}</td>
                          <td>{{ item.nps_left }}</td>
                          <td>{{ item.nps_right }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container" v-if="userData.roles.split(', ').includes('16')">
                    <ButtonSubmit
                      label="Add New Global Net Promoter Score"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GLOBAL-NETPROMOTERSCORE')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-shareoptions-global" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('ShareOptions')"
              >
                <span>Report Sharing Options</span>
                <i
                  :class="{
                    'fa-chevron-down': !shareoptionsAccordion,
                    'fa-chevron-up': shareoptionsAccordion,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="shareoptionsAccordion">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="sharingoptionsGLOBALSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GLOBAL-SHARINGOPTIONS')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            class="th-sharingoptions-global"
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                          >
                            <span>Borrow</span>
                          </th>
                          <th
                            style="
                              text-align: center;
                              background-color: rgba(244, 120, 32, 0.8);
                            "
                            v-for="head in table_headers_sharingoptions"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, GLOBALlibraryData.sharingOptions)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Sharing Options Question'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search sharing options..."
                                style=""
                                v-model="searchGlobalSharingOptions"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGlobalSharingOptionsSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGlobalSharingOptionsAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalSharingOptionsLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGlobalSharingOptions" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.sharing_options_id, 'GLOBAL-SHARINGOPTIONS')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.sharing_options_id, 'GLOBAL-SHARINGOPTIONS')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container" v-if="userData.roles.split(', ').includes('16')">
                    <ButtonSubmit
                      label="Add New Sharing Option"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GLOBAL-SHARINGOPTIONS')"
                    />
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
      <!-- end of global -->
      <!-- org -->
      <transition>
        <div
          class="table-container-org"
          style="background-color: white; padding: 10px; margin-bottom: 30px"
          v-show="orgContainer"
        >
          <h3>{{ org }} Library</h3>
          <div>
            <div id="accordion-competency-org" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('CompetencyORG')"
              >
                <span>Competency</span>
                <i
                  :class="{
                    'fa-chevron-down': !competencyAccordionORG,
                    'fa-chevron-up': competencyAccordionORG,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="competencyAccordionORG">
                  <div>
                    <div class="section-description">
                    <label>Competency Ranking Description: </label>
                    <textarea type="text" rows="4" v-model="ciiORGSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('ORG-CII')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="
                              background-color: rgba(14, 80, 113, 0.8);
                              color: white;
                            "
                            v-for="head in table_headers_competency"
                            :key="head"
                          >
                          <a
                              @click="sortByHeader(head, ORGlibraryData.competency)"
                              style="
                                display: flex;
                                flex-direction: row;
                                cursor: pointer;
                              "
                            >
                              {{
                                head == 'competency_name'
                                  ? 'Competency'
                                  : head == 'competency_desc'
                                  ? 'Description'
                                  : head == 'competency_code'
                                  ? 'Code'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'date_valid_from'
                                  ? 'Date Valid From'
                                  : head == 'date_valid_to'
                                  ? 'Date Valid To'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="tableCheckBox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                              type="text"
                              placeholder="Search competency..."
                              style=""
                              v-model="searchGlobalCompetency"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search description..."
                                style=""
                                v-model="searchGlobalCompetencyDesc"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search code..."
                                style=""
                                v-model="searchGlobalCompetencyCode"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGlobalCompetencyStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchGlobalCompetencySource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Added by..."
                                style=""
                                v-model="searchGlobalCompetencyAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchFrom"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidFrom"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchTo"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidTo"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Participant level..."
                                style=""
                                v-model="searchGlobalCompetencyParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalCompetencyLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredORGCompetency" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.competency_id, 'ORG')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.competency_id, 'ORG')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.competency_name }}
                          </td>
                          <td>{{ item.competency_desc }}</td>
                          <td>{{ item.competency_code }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ readDate(item.date_valid_from) }}</td>
                          <td>{{ readDate(item.date_valid_to) }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Org Competency"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                      "
                      @click="handleShowAdd('ORG')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-openended-org" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('OpenEndedORG')"
              >
                <span>Open-Ended</span>
                <i
                  :class="{
                    'fa-chevron-down': !openEndedAccordionORG,
                    'fa-chevron-up': openEndedAccordionORG,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="openEndedAccordionORG">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="oeqORGSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('ORG-OEQ')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="
                              background-color: rgba(14, 80, 113, 0.8);
                              color: white;
                            "
                            v-for="head in table_headers_openended"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, ORGlibraryData.openEnded)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchOrgOeq"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchOrgOeqStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchOrgOeqParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchOrgOeqSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchOrgOeqAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchOrgOeqLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredOrgOeq" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.oeq_id, 'ORG-OEQ')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.oeq_id, 'ORG-OEQ')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Open-Ended"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('ORG-OEQ')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-orgclimate-org" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('OrgClimateORG')"
              >
                <span>Organizational Climate</span>
                <i
                  :class="{
                    'fa-chevron-down': !orgclimateAccordionORG,
                    'fa-chevron-up': orgclimateAccordionORG,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="orgclimateAccordionORG">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="orgclimateORGSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('ORG-ORGCLIMATE')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="
                              background-color: rgba(14, 80, 113, 0.8);
                              color: white;
                            "
                            v-for="head in table_headers_orgclimate"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, ORGlibraryData.orgClimate)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchOrgOrgClimate"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchOrgOrgClimate"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchOrgOrgClimateParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchOrgOrgClimateSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchOrgOrgClimateAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchOrgOrgClimateLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredOrgOrgClimate" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.org_climate_id, 'ORG-ORGCLIMATE')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.org_climate_id, 'ORG-ORGCLIMATE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Org-Climate"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GLOBAL-ORGCLIMATE')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-netpromoterscore-org" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('NetPromoterScoreORG')"
              >
                <span>Net Promoter Score</span>
                <i
                  :class="{
                    'fa-chevron-down': !netpromoterScoreAccordionORG,
                    'fa-chevron-up': netpromoterScoreAccordionORG,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="netpromoterScoreAccordionORG">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="npsORGSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('ORG-NPS')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="
                              background-color: rgba(14, 80, 113, 0.8);
                              color: white;
                            "
                            v-for="head in table_headers_netpromoterscore"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, ORGlibraryData.netpromoterScore)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                            {{
                                head == 'nps_name'
                                  ? 'Name'
                                  : head == 'nps_description'
                                  ? 'Description'
                                  : head == 'nps_question'
                                  ? 'Question'
                                  : head == 'nps_left'
                                  ? 'Left Text'
                                  : head == 'nps_right'
                                  ? 'Right Text'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search name..."
                                style=""
                                v-model="searchOrgNetPromoterScore"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search description..."
                                style="min-width: 10px"
                                v-model="searchOrgNetPromoterScoreDescription"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search question..."
                                style=""
                                v-model="searchOrgNetPromoterScoreQuestion"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search left..."
                                style=""
                                v-model="searchOrgNetPromoterScoreLeft"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search right..."
                                style=""
                                v-model="searchOrgNetPromoterScoreRight"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style=""
                                v-model="searchOrgNetPromoterScoreStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchOrgNetPromoterScoreParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchOrgNetPromoterScoreSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchOrgNetPromoterScoreAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchOrgNetPromoterScoreLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredOrgNetPromoterScore" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.nps_id, 'ORG-NETPROMOTERSCORE')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.nps_id, 'ORG-NETPROMOTERSCORE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.nps_name }}
                          </td>
                          <td>{{ item.nps_description }}</td>
                          <td>{{ item.nps_question }}</td>
                          <td>{{ item.nps_left }}</td>
                          <td>{{ item.nps_right }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Net Promoter Score"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('ORG-NETPROMOTERSCORE')"
                    />
                  </div>
                </div>
              </transition>
            </div>
            <div id="accordion-shareoptions-org" class="accordion">
              <div
                class="accordion-header"
                @click="toggleAccordion('ShareOptionsORG')"
              >
                <span>Report Sharing Options</span>
                <i
                  :class="{
                    'fa-chevron-down': !shareoptionsAccordionORG,
                    'fa-chevron-up': shareoptionsAccordionORG,
                  }"
                  class="fas"
                ></i>
              </div>
              <transition name="accordion-body">
                <div class="accordion-body" v-if="shareoptionsAccordionORG">
                  <div>
                    <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="sharingoptionsORGSectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('ORG-SHARINGOPTIONS')"
                      />
                  </div>
                    <table id="table">
                      <thead>
                        <tr>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                          >
                          <span>Borrow</span>
                          </th>
                          <th
                            style="
                              text-align: center;
                              color: white;
                              background-color: rgba(14, 80, 113, 0.8);
                            "
                            v-for="head in table_headers_sharingoptions"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, ORGlibraryData.sharingOptions)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Sharing Options Question'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search sharing options..."
                                style=""
                                v-model="searchOrgSharingOptions"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchOrgSharingOptionsSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchOrgSharingOptionsAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchOrgSharingOptionsLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredOrgSharingOptions" :key="index">
                          <td class="td-checkbox">
                            <ButtonSubmit
                              label="Borrow"
                              style="
                                padding: 10px;
                                cursor: pointer;
                                font-size: 16px;
                                padding: 10px;
                                border-radius: 5px;
                                margin-top: 10px;
                                margin-right: 15px;
                                box-shadow: rgb(204, 204, 204) 2px 4px;
                              "
                              @click="handleShowBorrow(item.sharing_options_id, 'ORG-SHARINGOPTIONS')"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.sharing_options_id, 'ORG-SHARINGOPTIONS')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Sharing Option"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('ORG-SHARINGOPTIONS')"
                    />

                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>
      <!-- end of org -->
      <!-- gospi -->
      <div
        class="table-container-gospi"
        style="background-color: white; padding: 10px; margin-bottom: 30px"
      >
        <h3>{{ selectedSubOrg.subOrgId !== 0 ? selectedSubOrg.subOrgName : org }} Library</h3>
        <div>
          <div id="accordion-competency-gospi" class="accordion">
            <div
              class="accordion-header"
              @click="toggleAccordion('CompetencyGOSPI')"
            >
              <span>Competency</span>
              <i
                :class="{
                  'fa-chevron-down': !competencyAccordionGOSPI,
                  'fa-chevron-up': competencyAccordionGOSPI,
                }"
                class="fas"
              ></i>
            </div>
            <transition name="accordion-body">
              <div class="accordion-body" v-if="competencyAccordionGOSPI">
                <div>
                  <div class="section-description">
                    <label>Competency Ranking Description: </label>
                    <textarea type="text" rows="4" v-model="ciiGOSPISectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GOSPI-CII')"
                      />
                  </div>
                  <table id="table">
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align: center;
                            background-color: rgba(178, 194, 37, 0.8);
                          "
                        >
                          <input
                            type="checkbox"
                            name="tableCheckBox"
                            style="cursor: pointer"
                          />
                        </th>
                        <th
                          style="background-color: rgba(178, 194, 37, 0.8)"
                          v-for="head in table_headers_competency"
                          :key="head"
                        >
                        <a
                              @click="sortByHeader(head, GOSPIlibraryData.competency)"
                              style="
                                display: flex;
                                flex-direction: row;
                                cursor: pointer;
                              "
                            >
                              {{
                                head == 'competency_name'
                                  ? 'Competency'
                                  : head == 'competency_desc'
                                  ? 'Description'
                                  : head == 'competency_code'
                                  ? 'Code'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'date_valid_from'
                                  ? 'Date Valid From'
                                  : head == 'date_valid_to'
                                  ? 'Date Valid To'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="tableCheckBox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                              type="text"
                              placeholder="Search competency..."
                              style=""
                              v-model="searchGlobalCompetency"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search description..."
                                style=""
                                v-model="searchGlobalCompetencyDesc"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="textarea"
                                placeholder="Search code..."
                                style=""
                                v-model="searchGlobalCompetencyCode"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGlobalCompetencyStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchGlobalCompetencySource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Added by..."
                                style=""
                                v-model="searchGlobalCompetencyAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchFrom"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidFrom"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                class="input1"
                                type="datetime-local"
                                id="launchTo"
                                style=""
                                v-model="searchGlobalCompetencyDatesValidTo"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Participant level..."
                                style=""
                                v-model="searchGlobalCompetencyParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGlobalCompetencyLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGOSPICompetency" :key="index">
                          <td class="td-checkbox">
                            <input
                              type="checkbox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.competency_id, 'GOSPI')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.competency_name }}
                          </td>
                          <td>{{ item.competency_desc }}</td>
                          <td>{{ item.competency_code }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ readDate(item.date_valid_from) }}</td>
                          <td>{{ readDate(item.date_valid_to) }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add GOSPI Competency"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                      "
                      @click="handleShowAdd('GOSPI')"
                    />
                  </div>
              </div>
            </transition>
          </div>
          <div id="accordion-openended-gospi" class="accordion">
            <div
              class="accordion-header"
              @click="toggleAccordion('OpenEndedGOSPI')"
            >
              <span>Open-Ended</span>
              <i
                :class="{
                  'fa-chevron-down': !openEndedAccordionGOSPI,
                  'fa-chevron-up': openEndedAccordionGOSPI,
                }"
                class="fas"
              ></i>
            </div>
            <transition name="accordion-body">
              <div class="accordion-body" v-if="openEndedAccordionGOSPI">
                <div>
                  <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="oeqGOSPISectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GOSPI-OEQ')"
                      />
                  </div>
                  <table id="table">
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align: center;
                            background-color: rgba(178, 194, 37, 0.8);
                          "
                        >
                          <input
                            type="checkbox"
                            name="tableCheckBox"
                            style="cursor: pointer"
                          />
                        </th>
                        <th
                          style="background-color: rgba(178, 194, 37, 0.8)"
                          v-for="head in table_headers_openended"
                          :key="head"
                        >
                        <a
                            @click="sortByHeader(head, GOSPIlibraryData.openEnded)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="tableCheckBox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchGospiOeq"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGospiOeqStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGospiOeqParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGospiOeqSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGospiOeqAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGospiOeqLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGospiOeq" :key="index">
                          <td class="td-checkbox">
                            <input
                              type="checkbox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.oeq_id, 'GOSPI-OEQ')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                  </table>
                </div>
                <div class="button-container">
                    <ButtonSubmit
                      label="Add Open-Ended"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GOSPI-OEQ')"
                    />
                  </div>
              </div>
            </transition>
          </div>
          <div id="accordion-orgclimate-gospi" class="accordion">
            <div
              class="accordion-header"
              @click="toggleAccordion('OrgClimateGOSPI')"
            >
              <span>Organizational Climate</span>
              <i
                :class="{
                  'fa-chevron-down': !orgclimateAccordionGOSPI,
                  'fa-chevron-up': orgclimateAccordionGOSPI,
                }"
                class="fas"
              ></i>
            </div>
            <transition name="accordion-body">
              <div class="accordion-body" v-if="orgclimateAccordionGOSPI">
                <div>
                  <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="orgclimateGOSPISectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GOSPI-ORGCLIMATE')"
                      />
                  </div>
                  <table id="table">
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align: center;
                            background-color: rgba(178, 194, 37, 0.8);
                          "
                        >
                          <input
                            type="checkbox"
                            name="tableCheckBox"
                            style="cursor: pointer"
                          />
                        </th>
                        <th
                          style="background-color: rgba(178, 194, 37, 0.8)"
                          v-for="head in table_headers_orgclimate"
                          :key="head"
                        >
                        <a
                            @click="sortByHeader(head, GOSPIlibraryData.orgClimate)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Open-Ended Question'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="checkbox"
                              name="tableCheckBox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search open-ended..."
                                style=""
                                v-model="searchGospiOrgClimate"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style="min-width: 10px"
                                v-model="searchGospiOrgClimateStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGospiOrgClimateParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGospiOrgClimateSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGospiOrgClimateAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGospiOrgClimateLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGospiOrgClimate" :key="index">
                          <td class="td-checkbox">
                            <input
                              type="checkbox"
                              style="cursor: pointer"
                            />
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.org_climate_id, 'GOSPI-ORGCLIMATE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                  </table>
                </div>
                <div class="button-container">
                    <ButtonSubmit
                      label="Add Org-Climate"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GOSPI-ORGCLIMATE')"
                    />
                  </div>
              </div>
            </transition>
          </div>
          <div id="accordion-netpromoterscore-gospi" class="accordion">
            <div
              class="accordion-header"
              @click="toggleAccordion('NetPromoterScoreGOSPI')"
            >
              <span>Net Promoter Score</span>
              <i
                :class="{
                  'fa-chevron-down': !netpromoterScoreAccordionGOSPI,
                  'fa-chevron-up': netpromoterScoreAccordionGOSPI,
                }"
                class="fas"
              ></i>
            </div>
            <transition name="accordion-body">
              <div class="accordion-body" v-if="netpromoterScoreAccordionGOSPI">
                <div>
                  <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="npsGOSPISectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GOSPI-NPS')"
                      />
                  </div>
                  <table id="table">
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align: center;
                            background-color: rgba(178, 194, 37, 0.8);
                          "
                        >
                        </th>
                        <th
                          style="background-color: rgba(178, 194, 37, 0.8)"
                          v-for="head in table_headers_netpromoterscore"
                          :key="head"
                        >
                        <a
                            @click="sortByHeader(head, GOSPIlibraryData.netpromoterScore)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                            {{
                                head == 'nps_name'
                                  ? 'Name'
                                  : head == 'nps_description'
                                  ? 'Description'
                                  : head == 'nps_question'
                                  ? 'Question'
                                  : head == 'nps_left'
                                  ? 'Left Text'
                                  : head == 'nps_right'
                                  ? 'Right Text'
                                  : head == 'status'
                                  ? 'Status'
                                  : head == 'participant_level'
                                  ? 'Participant Level'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search name..."
                                style=""
                                v-model="searchGospiNetPromoterScore"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search description..."
                                style="min-width: 10px"
                                v-model="searchGospiNetPromoterScoreDescription"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search question..."
                                style=""
                                v-model="searchGospiNetPromoterScoreQuestion"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search left..."
                                style=""
                                v-model="searchGospiNetPromoterScoreLeft"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search right..."
                                style=""
                                v-model="searchGospiNetPromoterScoreRight"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search status..."
                                style=""
                                v-model="searchGospiNetPromoterScoreStatus"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search participant level..."
                                style=""
                                v-model="searchGospiNetPromoterScoreParticipantLevel"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search source..."
                                style=""
                                v-model="searchGospiNetPromoterScoreSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGospiNetPromoterScoreAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGospiNetPromoterScoreLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGospiNetPromoterScore" :key="index">
                          <td class="td-checkbox">
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.nps_id, 'GOSPI-NETPROMOTERSCORE')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.nps_name }}
                          </td>
                          <td>{{ item.nps_description }}</td>
                          <td>{{ item.nps_question }}</td>
                          <td>{{ item.nps_left }}</td>
                          <td>{{ item.nps_right }}</td>
                          <td>{{ item.status }}</td>
                          <td>{{ item.participant_level }}</td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                  </table>
                </div>
                <div class="button-container">
                    <ButtonSubmit
                      label="Add Net Promoter Score"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GOSPI-NETPROMOTERSCORE')"
                    />
                  </div>
              </div>
            </transition>
          </div>
          <div id="accordion-shareoptions-gospi" class="accordion">
            <div
              class="accordion-header"
              @click="toggleAccordion('ShareOptionsGOSPI')"
            >
              <span>Report Sharing Options</span>
              <i
                :class="{
                  'fa-chevron-down': !shareoptionsAccordionGOSPI,
                  'fa-chevron-up': shareoptionsAccordionGOSPI,
                }"
                class="fas"
              ></i>
            </div>
            <transition name="accordion-body">
              <div class="accordion-body" v-if="shareoptionsAccordionGOSPI">
                <div>
                  <div class="section-description">
                    <label>Description: </label>
                    <textarea type="text" rows="4" v-model="sharingoptionsGOSPISectionDescription" style="width: 50%; padding: 10px;"/>
                  </div>
                  <div class="button-container" style="margin-bottom: 10px;">
                    <ButtonSubmit
                        label="Save Description"
                        style="
                          padding: 10px;
                          cursor: pointer;
                          font-size: 16px;
                          padding: 10px;
                          border-radius: 5px;
                          margin-top: 10px;
                          margin-right: 15px;
                          box-shadow: rgb(204, 204, 204) 2px 4px;
                        "
                        @click="AddEditDescription('GOSPI-SHARINGOPTIONS')"
                      />
                  </div>
                  <table id="table">
                    <thead>
                      <tr>
                        <th
                          style="
                            text-align: center;
                            background-color: rgba(178, 194, 37, 0.8);
                          "
                        >
                          </th>
                          <th
                            style="
                              text-align: center;
                              background-color: rgba(178, 194, 37, 0.8);
                            "
                            v-for="head in table_headers_sharingoptions"
                            :key="head"
                          >
                          <a
                            @click="sortByHeader(head, GOSPIlibraryData.sharingOptions)"
                            style="
                              display: flex;
                              flex-direction: row;
                              cursor: pointer;
                            "
                            >
                              {{
                                head == 'question'
                                  ? 'Sharing Options Question'
                                  : head == 'source'
                                  ? 'Source'
                                  : head == 'added_by'
                                  ? 'Added By'
                                  : head == 'language'
                                  ? 'Language'
                                  : null
                              }}
                              <div class="sort-icon">
                                <a v-if="sortDirection == 'asc'"
                                  ><i class="fa-solid fa-sort-down"></i
                                ></a>
                                <a v-else
                                  ><i class="fa-solid fa-sort-up"></i
                                ></a>
                              </div>
                            </a>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search sharing options..."
                                style=""
                                v-model="searchGospiSharingOptions"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search Source..."
                                style=""
                                v-model="searchGospiSharingOptionsSource"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search added by..."
                                style=""
                                v-model="searchGospiSharingOptionsAddedBy"
                              />
                            </div>
                          </td>
                          <td>
                            <div class="input-container">
                              <input
                                type="text"
                                placeholder="Search language..."
                                style=""
                                v-model="searchGospiSharingOptionsLanguage"
                              />
                            </div>
                          </td>
                        </tr>
                        <tr v-for="(item, index) in filteredGospiSharingOptions" :key="index">
                          <td class="td-checkbox">
                          </td>
                          <td>
                            <button 
                            @click="handleViewModal(item.sharing_options_id, 'GOSPI-SHARINGOPTIONS')"
                            style="border: none; background: none; padding: 0; cursor: pointer;"
                            >
                              <i class="fa fa-info-circle" 
                                style="margin-right: 10px; font-size: 20px; cursor: pointer;"
                                >
                              </i>
                            </button>
                            {{ item.question }}
                          </td>
                          <td>{{ item.source }}</td>
                          <td>{{ item.added_by }}</td>
                          <td>{{ item.language }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="button-container">
                    <ButtonSubmit
                      label="Add New Sharing Option"
                      style="
                        padding: 10px;
                        cursor: pointer;
                        font-size: 16px;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                        margin-right: 15px;
                        box-shadow: rgb(204, 204, 204) 2px 4px;
                        text-align: left;
                      "
                      @click="handleShowAdd('GOSPI-SHARINGOPTIONS')"
                    />
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <!-- end of gospi -->
    </div>
  </div>
</template>
<script>
export default {
  props: ['userData', 'brandData'],
  component: [Header, ButtonSubmit, ButtonCancel],
  name: 'LibraryEditor',
  data: () => ({
    viewModal: false,
    viewBorrowedModal: false,
    showEditButton: true,
    showSaveButton: false,
    isButtonDisabled: false,

    selectedGlobalCompetency: null,
    selectedOrgCompetency: null,
    selectedGospiCompetency: null,
    selectedGlobalOpenEnded: null,
    selectedOrgOpenEnded: null,
    selectedGospiOpenEnded: null,
    selectedGlobalOrgClimate: null,
    selectedOrgOrgClimate: null,
    selectedGospiOrgClimate: null,
    selectedGlobalNetPromoterScore: null,
    selectedOrgNetPromoterScore: null,
    selectedGospiNetPromoterScore: null,
    selectedGlobalSharingOptions: null,
    selectedOrgSharingOptions: null,
    selectedGospiSharingOptions: null,

    borrowedGlobalCompetency: null,
    borrowedOrgCompetency: null,
    borrowedGlobalOpenEnded: null,
    borrowedOrgOpenEnded: null,
    borrowedGlobalOrgClimate: null,
    borrowedOrgOrgClimate: null,
    borrowedGlobalNetPromoterScore: null,
    borrowedOrgNetPromoterScore: null,
    borrowedGlobalSharingOptions: null,
    borrowedOrgSharingOptions: null,

    //Descripton on each section
    selectedGlobalCompetencyDescription: null,
    selectedOrgCompetencyDescription: null,
    selectedGospiCompetencyDescription: null,
    selectedGlobalOpenEndedDescription: null,
    selectedOrgOpenEndedDescription: null,
    selectedGospiOpenEndedDescription: null,
    selectedGlobalOrgClimateDescription: null,
    selectedOrgOrgClimateDescription: null,
    selectedGospiOrgClimateDescription: null,
    selectedGlobalNetPromoterScoreDescription: null,
    selectedOrgNetPromoterScoreDescription: null,
    selectedGospiNetPromoterScoreDescription: null,
    selectedGlobalSharingOptionsDescription: null,
    selectedOrgSharingOptionsDescription: null,
    selectedGospiSharingOptionsDescription: null,
    //
    borrowedGlobalCompetencyDescription: null,
    borrowedOrgCompetencyDescription: null,
    borrowedGlobalOpenEndedDescription: null,
    borrowedOrgOpenEndedDescription: null,
    borrowedGlobalOrgClimateDescription: null,
    borrowedOrgOrgClimateDescription: null,
    borrowedGlobalNetPromoterScoreDescription: null,
    borrowedOrgNetPromoterScoreDescription: null,
    borrowedGlobalSharingOptionsDescription: null,
    borrowedOrgSharingOptionsDescription: null,
    

    addGlobalCompetency: null,
    addOrgCompetency: null,
    addGospiCompetency: null,
    behaviorCount: 6,
    globalContainer: false,
    orgContainer: false,
    gospiContainer: false,

    competencyAccordion: false,
    openEndedAccordion: false,
    orgclimateAccordion: false,
    netpromoterScoreAccordion: false,
    shareoptionsAccordion: false,
    competencyAccordionORG: false,
    openEndedAccordionORG: false,
    orgclimateAccordionORG: false,
    netpromoterScoreAccordionORG: false,
    shareoptionsAccordionORG: false,
    competencyAccordionGOSPI: false,
    openEndedAccordionGOSPI: false,
    orgclimateAccordionGOSPI: false,
    netpromoterScoreAccordionGOSPI: false,
    shareoptionsAccordionGOSPI: false,
    headerSubjectFullName: '',
    table_headers_competency: [
      'competency_name',
      'competency_desc',
      'competency_code',
      'status',
      'source',
      'added_by',
      'date_valid_from',
      'date_valid_to',
      'participant_level',
      'language',
    ],
    table_headers_openended: [
      'question',
      'status',
      'participant_level',
      'source',
      'added_by',
      'language'
    ],
    table_headers_orgclimate: [
      'question',
      'status',
      'participant_level',
      'source',
      'added_by',
      'language'
    ],
    table_headers_netpromoterscore: [
      'nps_name',
      'nps_description',
      'nps_question',
      'nps_left',
      'nps_right',
      'status',
      'participant_level',
      'source',
      'added_by',
      'language',
    ],
    table_headers_sharingoptions: [
      'question',
      'source',
      'added_by',
      'language'
    ],
    sortDirection: '',
    sortColumn: '',
    subOrgs: [],
    org: '',
    forParticipant: '',
    selectedSubOrg: { 
      subOrgId: 0,
      subOrgName: ''
     },
    orgclimateSupertraits: 
    [
      {
      supertraitCode: 'ERX',
      superTrait: 'Emotional Reactiveness',
      },
      {
      supertraitCode: 'EX',
      superTrait: 'Extraversion',
      },
      {
      supertraitCode: 'OX',
      superTrait: 'Openness to Experience',
      },
      {
      supertraitCode: 'AX',
      superTrait: 'Agreeableness',
      },
      {
      supertraitCode: 'CX',
      superTrait: 'Conscientiousness',
      },
    ],

    GLOBALSectionDescriptionData: {
      cii: '',
      oeq: '',
      orgclimate: '',
      nps: '',
      sharingoptions: ''
    },
    ORGSectionDescriptionData: {
      cii: '',
      oeq: '',
      orgclimate: '',
      nps: '',
      sharingoptions: ''
    },
    GOSPISectionDescriptionData: {
      cii: '',
      oeq: '',
      orgclimate: '',
      nps: '',
      sharingoptions: ''
    },

     GOSPIlibraryData: {
      competency: [],
      behavior: [],
      openEnded: [],
      orgClimate: [],
      netpromoterScore: [],
      sharingOptions: []
    },
    ORGlibraryData: {
      competency: [],
      behavior: [],
      openEnded: [],
      orgClimate: [],
      netpromoterScore: [],
      sharingOptions: []
    },
    GLOBALlibraryData: {
      competency: [],
      behavior: [],
      openEnded: [],
      orgClimate: [],
      netpromoterScore: [],
      sharingOptions: []
    },
    searchGlobalCompetency: '',
    searchGlobalCompetencyDesc: '',
    searchGlobalCompetencyCode: '',
    searchGlobalCompetencyStatus: '',
    searchGlobalCompetencySource: '',
    searchGlobalCompetencyAddedBy: '',
    searchGlobalCompetencyDatesValidFrom: '',
    searchGlobalCompetencyDatesValidTo: '',
    searchGlobalCompetencyParticipantLevel: '',
    searchGlobalCompetencyLanguage: '',
    searchOrgCompetency: '',
    searchOrgCompetencyDesc: '',
    searchOrgCompetencyCode: '',
    searchOrgCompetencyStatus: '',
    searchOrgCompetencySource: '',
    searchOrgCompetencyAddedBy: '',
    searchOrgCompetencyDatesValidFrom: '',
    searchOrgCompetencyDatesValidTo: '',
    searchOrgCompetencyParticipantLevel: '',
    searchOrgCompetencyLanguage: '',
    searchGospiCompetency: '',
    searchGospiCompetencyDesc: '',
    searchGospiCompetencyCode: '',
    searchGospiCompetencyStatus: '',
    searchGospiCompetencySource: '',
    searchGospiCompetencyAddedBy: '',
    searchGospiCompetencyDatesValidFrom: '',
    searchGospiCompetencyDatesValidTo: '',
    searchGospiCompetencyParticipantLevel: '',
    searchGospiCompetencyLanguage: '',

    searchGlobalOeq: '',
    searchGlobalOeqStatus: '',
    searchGlobalOeqParticipantLevel: '',
    searchGlobalOeqSource: '',
    searchGlobalOeqAddedBy: '',
    searchGlobalOeqLanguage: '',
    searchOrgOeq: '',
    searchOrgOeqStatus: '',
    searchOrgOeqParticipantLevel: '',
    searchOrgOeqSource: '',
    searchOrgOeqAddedBy: '',
    searchOrgOeqLanguage: '',
    searchGospiOeq: '',
    searchGospiOeqStatus: '',
    searchGospiOeqParticipantLevel: '',
    searchGospiOeqSource: '',
    searchGospiOeqAddedBy: '',
    searchGospiOeqLanguage: '',

    searchGlobalOrgClimate: '',
    searchGlobalOrgClimateStatus: '',
    searchGlobalOrgClimateParticipantLevel: '',
    searchGlobalOrgClimateSource: '',
    searchGlobalOrgClimateAddedBy: '',
    searchGlobalOrgClimateLanguage: '',
    searchOrgOrgClimate: '',
    searchOrgOrgClimateStatus: '',
    searchOrgOrgClimateParticipantLevel: '',
    searchOrgOrgClimateSource: '',
    searchOrgOrgClimateAddedBy: '',
    searchOrgOrgClimateLanguage: '',
    searchGospiOrgClimate: '',
    searchGospiOrgClimateStatus: '',
    searchGospiOrgClimateParticipantLevel: '',
    searchGospiOrgClimateSource: '',
    searchGospiOrgClimateAddedBy: '',
    searchGospiOrgClimateLanguage: '',

    searchGlobalNetPromoterScore: '',
    searchGlobalNetPromoterScoreDescription: '',
    searchGlobalNetPromoterScoreQuestion: '',
    searchGlobalNetPromoterScoreLeft: '',
    searchGlobalNetPromoterScoreRight: '',
    searchGlobalNetPromoterScoreStatus: '',
    searchGlobalNetPromoterScoreParticipantLevel: '',
    searchGlobalNetPromoterScoreSource: '',
    searchGlobalNetPromoterScoreAddedBy: '',
    searchGlobalNetPromoterScoreLanguage: '',
    searchOrgNetPromoterScore: '',
    searchOrgNetPromoterScoreDescription: '',
    searchOrgNetPromoterScoreQuestion: '',
    searchOrgNetPromoterScoreLeft: '',
    searchOrgNetPromoterScoreRight: '',
    searchOrgNetPromoterScoreStatus: '',
    searchOrgNetPromoterScoreParticipantLevel: '',
    searchOrgNetPromoterScoreSource: '',
    searchOrgNetPromoterScoreAddedBy: '',
    searchOrgNetPromoterScoreLanguage: '',
    searchGospiNetPromoterScore: '',
    searchGospiNetPromoterScoreDescription: '',
    searchGospiNetPromoterScoreQuestion: '',
    searchGospiNetPromoterScoreLeft: '',
    searchGospiNetPromoterScoreRight: '',
    searchGospiNetPromoterScoreStatus: '',
    searchGospiNetPromoterScoreParticipantLevel: '',
    searchGospiNetPromoterScoreSource: '',
    searchGospiNetPromoterScoreAddedBy: '',
    searchGospiNetPromoterScoreLanguage: '',

    searchGlobalSharingOptions: '',
    searchGlobalSharingOptionsSource: '',
    searchGlobalSharingOptionsAddedBy: '',
    searchGlobalSharingOptionsLanguage: '',
    searchOrgSharingOptions: '',
    searchOrgSharingOptionsSource: '',
    searchOrgSharingOptionsAddedBy: '',
    searchOrgSharingOptionsLanguage: '',
    searchGospiSharingOptions: '',
    searchGospiSharingOptionsSource: '',
    searchGospiSharingOptionsAddedBy: '',
    searchGospiSharingOptionsLanguage: '',

    enabled: true,
    dragging: false,
    isHovered: false,
    behaviorModified: false,
      
    languageOptions: [
      { value: 'af', label: 'Afrikaans' },
      { value: 'sq', label: 'Albanian' },
      { value: 'ar-dz', label: 'Arabic (Algeria)' },
      { value: 'ar-bh', label: 'Arabic (Bahrain)' },
      { value: 'ar-eg', label: 'Arabic (Egypt)' },
      { value: 'ar-iq', label: 'Arabic (Iraq)' },
      { value: 'ar-jo', label: 'Arabic (Jordan)' },
      { value: 'ar-kw', label: 'Arabic (Kuwait)' },
      { value: 'ar-lb', label: 'Arabic (Lebanon)' },
      { value: 'ar-ly', label: 'Arabic (Libya)' },
      { value: 'ar-ma', label: 'Arabic (Morocco)' },
      { value: 'ar-om', label: 'Arabic (Oman)' },
      { value: 'ar-qa', label: 'Arabic (Qatar)' },
      { value: 'ar-sa', label: 'Arabic (Saudi Arabia)' },
      { value: 'ar-sy', label: 'Arabic (Syria)' },
      { value: 'ar-tn', label: 'Arabic (Tunisia)' },
      { value: 'ar-ae', label: 'Arabic (U.A.E.)' },
      { value: 'ar-ye', label: 'Arabic (Yemen)' },
      { value: 'eu', label: 'Basque' },
      { value: 'be', label: 'Belarusian' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'ca', label: 'Catalan' },
      { value: 'zh-hk', label: 'Chinese (Hong Kong)' },
      { value: 'zh-cn', label: 'Chinese (PRC)' },
      { value: 'zh-sg', label: 'Chinese (Singapore)' },
      { value: 'zh-tw', label: 'Chinese (Taiwan)' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl-be', label: 'Dutch (Belgium)' },
      { value: 'nl', label: 'Dutch (Standard)' },
      { value: 'en', label: 'English' },
      { value: 'en-au', label: 'English (Australia)' },
      { value: 'en-bz', label: 'English (Belize)' },
      { value: 'en-ca', label: 'English (Canada)' },
      { value: 'en-ie', label: 'English (Ireland)' },
      { value: 'en-jm', label: 'English (Jamaica)' },
      { value: 'en-nz', label: 'English (New Zealand)' },
      { value: 'en-za', label: 'English (South Africa)' },
      { value: 'en-tt', label: 'English (Trinidad)' },
      { value: 'en-gb', label: 'English (United Kingdom)' },
      { value: 'en-us', label: 'English (United States)' },
      { value: 'et', label: 'Estonian' },
      { value: 'fo', label: 'Faeroese' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr-be', label: 'French (Belgium)' },
      { value: 'fr-ca', label: 'French (Canada)' },
      { value: 'fr-lu', label: 'French (Luxembourg)' },
      { value: 'fr-mc', label: 'French (Monaco)' },
      { value: 'fr-ch', label: 'French (Switzerland)' },
      { value: 'gd', label: 'Gaelic (Scotland)' },
      { value: 'de-at', label: 'German (Austria)' },
      { value: 'de-li', label: 'German (Liechtenstein)' },
      { value: 'de-lu', label: 'German (Luxembourg)' },
      { value: 'de-ch', label: 'German (Switzerland)' },
      { value: 'de', label: 'German (Standard)' },
      { value: 'el', label: 'Greek' },
      { value: 'he', label: 'Hebrew' },
      { value: 'hu', label: 'Hungarian' },
      { value: 'is', label: 'Icelandic' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it-ch', label: 'Italian (Switzerland)' },
      { value: 'it', label: 'Italian (Standard)' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'lv', label: 'Latvian' },
      { value: 'lt', label: 'Lithuanian' },
      { value: 'mk', label: 'Macedonian (FYROM)' },
      { value: 'ms', label: 'Malay' },
      { value: 'mt', label: 'Maltese' },
      { value: 'no', label: 'Norwegian' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt-br', label: 'Portuguese (Brazil)' },
      { value: 'pt', label: 'Portuguese (Standard)' },
      { value: 'rm', label: 'Rhaeto-Romanic' },
      { value: 'ro-md', label: 'Romanian (Moldova)' },
      { value: 'ro', label: 'Romanian (Standard)' },
      { value: 'ru-md', label: 'Russian (Moldova)' },
      { value: 'ru', label: 'Russian' },
      { value: 'sz', label: 'Sami (Lappish)' },
      { value: 'sr', label: 'Serbian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'sl', label: 'Slovenian' },
      { value: 'sb', label: 'Sorbian' },
      { value: 'es-ar', label: 'Spanish (Argentina)' },
      { value: 'es-bo', label: 'Spanish (Bolivia)' },
      { value: 'es-cl', label: 'Spanish (Chile)' },
      { value: 'es-co', label: 'Spanish (Colombia)' },
      { value: 'es-cr', label: 'Spanish (Costa Rica)' },
      { value: 'es-do', label: 'Spanish (Dominican Republic)' },
      { value: 'es-ec', label: 'Spanish (Ecuador)' },
      { value: 'es-sv', label: 'Spanish (El Salvador)' },
      { value: 'es-gt', label: 'Spanish (Guatemala)' },
      { value: 'es-hn', label: 'Spanish (Honduras)' },
      { value: 'es-mx', label: 'Spanish (Mexico)' },
      { value: 'es-ni', label: 'Spanish (Nicaragua)' },
      { value: 'es-pa', label: 'Spanish (Panama)' },
      { value: 'es-py', label: 'Spanish (Paraguay)' },
      { value: 'es-pe', label: 'Spanish (Peru)' },
      { value: 'es-pr', label: 'Spanish (Puerto Rico)' },
      { value: 'es', label: 'Spanish (Standard)' },
      { value: 'es-uy', label: 'Spanish (Uruguay)' },
      { value: 'es-ve', label: 'Spanish (Venezuela)' },
      { value: 'sx', label: 'Sutu' },
      { value: 'sv-fi', label: 'Swedish (Finland)' },
      { value: 'sv', label: 'Swedish (Standard)' },
      { value: 'th', label: 'Thai' },
      { value: 'ts', label: 'Tsonga' },
      { value: 'tn', label: 'Tswana' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' },
      { value: 'ur', label: 'Urdu' },
      { value: 've', label: 'Venda' },
      { value: 'vi', label: 'Vietnamese' },
      { value: 'xh', label: 'Xhosa' },
      { value: 'ji', label: 'Yiddish' },
      { value: 'zu', label: 'Zulu' },
    ],

    ParticipantLevelOptions: [
      { value: 'Generic', label: 'Generic' },
      { value: 'General Manager', label: 'General Manager' },
      { value: 'Team Leader', label: 'Team Leader' },
      { value: 'Individual Contributor', label: 'Individual Contributor' },
      { value: 'Board', label: 'Board' }
    ],

    CompetencyCodeList: [
      {"Competency Code": "KDY", "Behavior Count": 6},
      {"Competency Code": "CP", "Behavior Count": 6},
      {"Competency Code": "SCP", "Behavior Count": 6},
      {"Competency Code": "LIC", "Behavior Count": 6},
      {"Competency Code": "LDF", "Behavior Count": 6},
      {"Competency Code": "EUSO", "Behavior Count": 6},
      {"Competency Code": "SA", "Behavior Count": 7},
      {"Competency Code": "ISR", "Behavior Count": 5},
      {"Competency Code": "EI", "Behavior Count": 6},
      {"Competency Code": "GP", "Behavior Count": 5},
      {"Competency Code": "OAW", "Behavior Count": 6},
      {"Competency Code": "CLD", "Behavior Count": 4},
      {"Competency Code": "LA", "Behavior Count": 5},
      {"Competency Code": "CE", "Behavior Count": 5},
      {"Competency Code": "LS", "Behavior Count": 5},
      {"Competency Code": "LO", "Behavior Count": 6},
      {"Competency Code": "LOC", "Behavior Count": 6},
      {"Competency Code": "AEI", "Behavior Count": 6},
      {"Competency Code": "BTC", "Behavior Count": 9},
      {"Competency Code": "CPT", "Behavior Count": 8},
      {"Competency Code": "HH", "Behavior Count": 5},
      {"Competency Code": "BGIW", "Behavior Count": 6},
      {"Competency Code": "RI", "Behavior Count": 4},
      {"Competency Code": "ATR", "Behavior Count": 5},
      {"Competency Code": "TW", "Behavior Count": 6},
      {"Competency Code": "TIO", "Behavior Count": 4},
      {"Competency Code": "RSH", "Behavior Count": 6},
      {"Competency Code": "WEI", "Behavior Count": 6},
      {"Competency Code": "DTO", "Behavior Count": 6}, 
      {"Competency Code": "LC", "Behavior Count": 6},
      {"Competency Code": "LTO", "Behavior Count": 4}
    ],
    sharingOptions: [
      { value: '20', label: 'Coach Sharing' },
      { value: '4', label: 'Small Group Sharing' },
      { value: '19', label: 'Internal HR' }
    ]

  }),
  async mounted() {
    console.log('userData: ',this.userData)
    try {
      const res = await api.get(`/organizations/${this.userData.org_id}`)
      if (res.status === 200) {
        this.org = res.data.org_name
      }
    } catch (error) {
      console.log(error)
    }
    
    try {
      const res = await api.get(`/sub-organizations/${this.userData.org_id}`);
      if (res.status === 200) {
        for (let i = 0; i < res.data.length; i++) {
          const subOrgId = res.data[i].suborg_id;
          const subOrgName = res.data[i].suborg_name;

          this.subOrgs.push({
            subOrgId,
            subOrgName
          });
        }
      }
    } catch (error) {
      console.log(error);
    }

  },
  methods: {
    async getLibraryData() {
      this.getSectionDescriptionLibrary()
        this.GLOBALlibraryData = {}
        this.ORGlibraryData = {}
        this.GOSPIlibraryData = {}
        //CompetencyData
        // GOSPI
        try {
          const res = await api.post('/360Competency', {
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
          })
          if(res.status === 200){
            this.GOSPIlibraryData.competency = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // ORG
        try {
          const res = await api.post('/360Competency', {
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
          })
          if(res.status === 200){
            this.ORGlibraryData.competency = res.data
            console.log('org lib', this.ORGlibraryData.competency)
          }
        } catch (error) {
          console.log(error)
        }
        // GLOBAL
        try {
          const res = await api.post('/360Competency', {
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
          })
          if(res.status === 200){
            this.GLOBALlibraryData.competency = res.data
          }
        } catch (error) {
          console.log(error)
        }
      //End of CompetencyData
      //BehaviorData
        // GOSPI
        try {
          const res = await api.post('/360Behavior', {
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GOSPIlibraryData.behavior = res.data
            for (let behavior of this.GOSPIlibraryData.behavior) {
                const competencyId = behavior.competency_id;

                // Find the corresponding competency in competencyList
                const competency = this.GOSPIlibraryData.competency.find(
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
          }
        } catch (error) {
          console.log(error)
        }
        // ORG
        try {
          const res = await api.post('/360Behavior', {
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.ORGlibraryData.behavior = res.data
            for (let behavior of this.ORGlibraryData.behavior) {
                const competencyId = behavior.competency_id;

                // Find the corresponding competency in competencyList
                const competency = this.ORGlibraryData.competency.find(
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
          }
        } catch (error) {
          console.log(error)
        }
        // GLOBAL
        try {
          const res = await api.post('/360Behavior', {
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GLOBALlibraryData.behavior = res.data
            for (let behavior of this.GLOBALlibraryData.behavior) {
                const competencyId = behavior.competency_id;

                // Find the corresponding competency in competencyList
                const competency = this.GLOBALlibraryData.competency.find(
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
          }
        } catch (error) {
          console.log(error)
        }
      //End of BehaviorData
      //OEQData
        // GOSPI
        try {
          const res = await api.post('/360Oeq', {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GOSPIlibraryData.openEnded = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // ORG
        try {
          const res = await api.post('/360Oeq', {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.ORGlibraryData.openEnded = res.data
            console.log('from database: ', this.ORGlibraryData)
          }
        } catch (error) {
          console.log(error)
        }
        // GLOBAL
        try {
          const res = await api.post('/360Oeq', {
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GLOBALlibraryData.openEnded = res.data
          }
        } catch (error) {
          console.log(error)
        }
      //End of OEQData
      //OrgClimateData
        // GOSPI
        try {
          const res = await api.post('/360OrgClimate', {
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GOSPIlibraryData.orgClimate = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // ORG
        try {
          const res = await api.post('/360OrgClimate', {
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.ORGlibraryData.orgClimate = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // GLOBAL
        try {
          const res = await api.post('/360OrgClimate', {
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GLOBALlibraryData.orgClimate = res.data
          }
        } catch (error) {
          console.log(error)
        }
      //End of OrgClimateData
      //NetPromoterScoreData
        // GOSPI
        try {
          const res = await api.post('/360NetPromoterScore', {
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GOSPIlibraryData.netpromoterScore = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // ORG
        try {
          const res = await api.post('/360NetPromoterScore', {
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.ORGlibraryData.netpromoterScore = res.data
          }
        } catch (error) {
          console.log(error)
        }
        // GLOBAL
        try {
          const res = await api.post('/360NetPromoterScore', {
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GLOBALlibraryData.netpromoterScore = res.data
          }
        } catch (error) {
          console.log(error)
        }
      //End of NetPromoterScoreData
      //Sharing Options
      // GOSPI
      try {
        const res = await api.post('/360sharingoptions', {
              org_id: this.userData.org_id,
              suborg_id: this.selectedSubOrg.subOrgId,
              program_id: 0,
              iteration_id: 0,
              for_participant: this.forParticipant
        })
        if(res.status === 200){
          this.GOSPIlibraryData.sharingOptions = res.data
        }
      } catch (error) {
        console.log(error)
      }
      // ORG
      try {
        const res = await api.post('/360sharingoptions', {
              org_id: this.userData.org_id,
              suborg_id: 0,
              program_id: 0,
              iteration_id: 0,
              for_participant: this.forParticipant
        })
        if(res.status === 200){
          this.ORGlibraryData.sharingOptions = res.data
        }
      } catch (error) {
        console.log(error)
      }
      // Global
      console.log('userData: ',this.userData)
      try {
          const res = await api.post('/360sharingoptions', {
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0,
                for_participant: this.forParticipant
          })
          if(res.status === 200){
            this.GLOBALlibraryData.sharingOptions = res.data
          }
        } catch (error) {
          console.log(error)
        }
    },
    async getSectionData(global, org_id, suborg_id) {
      try {
        const res = await api.post(`/get-360section-gospi`, {
          global: global,
          org_id: org_id,
          suborg_id: suborg_id,
          program_id: 0,
          iteration_id: 0
        });

        if (res.status === 200) {
          return res.data;
        }
      } catch (error) {
        console.log(error);
      }
      return null;
    },
    async getSectionDescriptionLibrary() {
      this.GLOBALSectionDescriptionData = {};
      this.ORGSectionDescriptionData = {};
      this.GOSPISectionDescriptionData = {};

      try {
        const globalData = await this.getSectionData(1, 0, 0);
        if (globalData?.length) {
          this.GLOBALSectionDescriptionData.cii = globalData.find(section => section.section_name === "Competency Ranking") ?? null;
          this.GLOBALSectionDescriptionData.oeq = globalData.find(section => section.section_name === "Open-ended Questions") ?? null;
          this.GLOBALSectionDescriptionData.orgclimate = globalData.find(section => section.section_name === "Organizational Climate") ?? null;
          this.GLOBALSectionDescriptionData.nps = globalData.find(section => section.section_name === "Collaboration strengths ranking") ?? null;
          this.GLOBALSectionDescriptionData.sharingoptions = globalData.find(section => section.section_name === "Report Sharing Options") ?? null;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const orgData = await this.getSectionData(0, this.userData.org_id, 0);
        if (orgData?.length) {
          this.ORGSectionDescriptionData.cii = orgData.find(section => section.section_name === "Competency Ranking") ?? null;
          this.ORGSectionDescriptionData.oeq = orgData.find(section => section.section_name === "Open-ended Questions") ?? null;
          this.ORGSectionDescriptionData.orgclimate = orgData.find(section => section.section_name === "Organizational Climate") ?? null;
          this.ORGSectionDescriptionData.nps = orgData.find(section => section.section_name === "Collaboration strengths ranking") ?? null;
          this.ORGSectionDescriptionData.sharingoptions = orgData.find(section => section.section_name === "Report Sharing Options") ?? null;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        const gospiData = await this.getSectionData(0, this.userData.org_id, this.selectedSubOrg.subOrgId);
        if (gospiData?.length) {
          this.GOSPISectionDescriptionData.cii = gospiData.find(section => section.section_name === "Competency Ranking") ?? null;
          this.GOSPISectionDescriptionData.oeq = gospiData.find(section => section.section_name === "Open-ended Questions") ?? null;
          this.GOSPISectionDescriptionData.orgclimate = gospiData.find(section => section.section_name === "Organizational Climate") ?? null;
          this.GOSPISectionDescriptionData.nps = gospiData.find(section => section.section_name === "Collaboration strengths ranking") ?? null;
          this.GOSPISectionDescriptionData.sharingoptions = gospiData.find(section => section.section_name === "Report Sharing Options") ?? null;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async AddEditDescription(string) {
      if (string === 'GLOBAL-CII') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Competency Ranking',
                section_description: this.ciiGLOBALSectionDescription,
                added_by: this.userData.email,
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
      else if (string === 'GLOBAL-OEQ') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Open-ended Questions',
                section_description: this.oeqGLOBALSectionDescription,
                added_by: this.userData.email,
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GLOBAL-ORGCLIMATE') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Organizational Climate',
                section_description: this.orgclimateGLOBALSectionDescription,
                added_by: this.userData.email,
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GLOBAL-NPS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Collaboration strengths ranking',
                section_description: this.npsGLOBALSectionDescription,
                added_by: this.userData.email,
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GLOBAL-SHARINGOPTIONS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Report Sharing Options',
                section_description: this.sharingoptionsGLOBALSectionDescription,
                added_by: this.userData.email,
                global: 1,
                org_id: 0,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'ORG-CII') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Competency Ranking',
                section_description: this.ciiORGSectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
      else if (string === 'ORG-OEQ') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Open-ended Questions',
                section_description: this.oeqORGSectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'ORG-ORGCLIMATE') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Organizational Climate',
                section_description: this.orgclimateORGSectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'ORG-NPS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Collaboration strengths ranking',
                section_description: this.npsORGSectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'ORG-SHARINGOPTIONS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Report Sharing Options',
                section_description: this.sharingoptionsORGSectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: 0,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GOSPI-CII') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Competency Ranking',
                section_description: this.ciiGOSPISectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
      else if (string === 'GOSPI-OEQ') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Open-ended Questions',
                section_description: this.oeqGOSPISectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GOSPI-ORGCLIMATE') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Organizational Climate',
                section_description: this.orgclimateGOSPISectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GOSPI-NPS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Collaboration strengths ranking',
                section_description: this.npsGOSPISectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if (string === 'GOSPI-SHARINGOPTIONS') {
        Swal.fire({
          text: `Are you sure you want to save this description?`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const res = await api.post(`insert-360section`, {
                section_name: 'Report Sharing Options',
                section_description: this.sharingoptionsGOSPISectionDescription,
                added_by: this.userData.email,
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0
              });
              if (res.status === 200) {
                console.log(res);
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    },
    handleDragEnd(event) {
      // Get the dragged and dropped elements
      const draggedBehavior = event.item;
      const droppedBehavior = event.to.children[event.newIndex];

      // Get the behavior indices
      const draggedIndex = Array.from(draggedBehavior.parentNode.children).indexOf(draggedBehavior);
      const droppedIndex = Array.from(droppedBehavior.parentNode.children).indexOf(droppedBehavior);

      // Swap behavior codes based on the indices
      this.swapBehaviorCodes(draggedIndex, droppedIndex);

      // Reset dragging and set behaviorModified to true
      this.dragging = false;
      this.behaviorModified = true;
    },
    swapBehaviorCodes(draggedIndex, droppedIndex) {
      // Swap behavior codes based on the indices
      const behaviors = this.selectedGlobalCompetency.behaviors;
      const draggedBehavior = behaviors[draggedIndex];
      const droppedBehavior = behaviors[droppedIndex];

      // Swap behavior codes directly
      [draggedBehavior.behavior_code, droppedBehavior.behavior_code] = [droppedBehavior.behavior_code, draggedBehavior.behavior_code];
    },
    checkMove() {
    },
    isWithinDateRange(dateFrom, dateTo, rangeStart, rangeEnd) {
      const itemDateFrom = new Date(dateFrom);
      const itemDateTo = new Date(dateTo);

      // Set the time to midnight for item dates
      itemDateFrom.setHours(0, 0, 0, 0);
      itemDateTo.setHours(0, 0, 0, 0);

      if (!rangeStart && !rangeEnd) {
        return true; // No date range restriction
      }

      if (rangeStart) {
        rangeStart.setHours(0, 0, 0, 0);
      }
      if (rangeEnd) {
        rangeEnd.setHours(0, 0, 0, 0);
      }

      return (
        (!rangeStart || itemDateFrom >= rangeStart) &&
        (!rangeEnd || itemDateTo <= rangeEnd)
      );
    },
    readDate(data) {
      var parsedDate = Date.parse(data);

      if (isNaN(data) && !isNaN(parsedDate)) {
        const humanReadableDateTime = new Date(data).toLocaleString();
        return humanReadableDateTime;
      } else {
        return data;
      }
    },
    formatDateTime(date) {
      if (!date) return '';

      const localDate = new Date(date);
      const year = localDate.getFullYear();
      const month = `0${localDate.getMonth() + 1}`.slice(-2);
      const day = `0${localDate.getDate()}`.slice(-2);
      const hours = `0${localDate.getHours()}`.slice(-2);
      const minutes = `0${localDate.getMinutes()}`.slice(-2);

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    async handleSave(str) {
      this.isButtonDisabled = true
      if(str === 'GLOBAL'){
        try {
          let competencyId = this.selectedGlobalCompetency.competency_id;
          if (!competencyId) {
            // Insert new competency
            this.selectedGlobalCompetency.global = 1;
            this.selectedGlobalCompetency.org_id = 0;
            this.selectedGlobalCompetency.suborg_id = 0;
            this.selectedGlobalCompetency.program_id = 0;
            this.selectedGlobalCompetency.iteration_id = 0;
            const competencyRes = await api.post('/insert-360Competency', this.selectedGlobalCompetency);
            if (competencyRes.status === 200) {
              this.isButtonDisabled = false;
              Swal.fire({
                title: '',
                text: 'Competency Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
            }
            console.log('New competency added successfully.', competencyRes.data);
            competencyId = competencyRes.data.insertId; // Retrieve the competency ID from the response
            console.log('from database C-ID:', competencyId);
          } else {
            // Update existing competency
            const res = await api.put(`/360Competency/${competencyId}`, this.selectedGlobalCompetency);
            console.log(`Competency ${competencyId} updated successfully.`, res);
            if (res.status === 200) {
              this.isButtonDisabled = false;
              Swal.fire({
                title: '',
                text: 'Competency Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
            }
          }
          for (const [index, behavior] of this.selectedGlobalCompetency.behaviors.entries()) {
            if (behavior.behavior_id) {
              // Update existing behavior
              behavior.behavior_code = this.selectedGlobalCompetency.competency_code + (index + 1);
              const res = await api.put(`/360Behavior/${behavior.behavior_id}`, behavior);
              console.log(`Behavior ${behavior.behavior_id} updated successfully.`, res);
            } else {
              behavior.global = 1;
              behavior.org_id = 0;
              behavior.suborg_id = 0;
              behavior.program_id = 0;
              behavior.iteration_id = 0;
              behavior.competency_id = competencyId; // Assign the retrieved competency ID to each behavior

              // Generate behavior code based on the length of behaviors array
              behavior.behavior_code = this.selectedGlobalCompetency.competency_code + (index + 1);

              // Insert new behavior
              const res = await api.post('/insert-360Behavior', behavior);
              console.log(`New behavior added successfully.`, res.data);
            }
          }
          const modalBOX = document.getElementById('modal');
          modalBOX.style.display = 'none';
        } catch (error) {
          console.log(error);
        }
        this.selectedGlobalCompetency = {};
      } else if(str === 'ORG') {
        try {
            let competencyId = this.selectedOrgCompetency.competency_id;
            if (!competencyId) {
              // Insert new competency
              this.selectedOrgCompetency.global = 0;
              this.selectedOrgCompetency.org_id = this.userData.org_id;
              this.selectedOrgCompetency.suborg_id = 0;
              this.selectedOrgCompetency.program_id = 0;
              this.selectedOrgCompetency.iteration_id = 0;
              const competencyRes = await api.post('/insert-360Competency', this.selectedOrgCompetency);
              console.log('New competency added successfully.', competencyRes.data);
              competencyId = competencyRes.data.insertId; // Retrieve the competency ID from the response
              console.log('from database C-ID:', competencyId);
              if(competencyRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Competency Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing competency
              const res = await api.put(`/360Competency/${competencyId}`, this.selectedOrgCompetency);
              console.log(`Competency ${competencyId} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Competency Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            for (const [index, behavior] of this.selectedOrgCompetency.behaviors.entries()) {
              if (behavior.behavior_id) {
                // Update existing behavior
                behavior.behavior_code = this.selectedOrgCompetency.competency_code + (index + 1);
                const res = await api.put(`/360Behavior/${behavior.behavior_id}`, behavior);
                console.log(`Behavior ${behavior.behavior_id} updated successfully.`, res);
                console.log(behavior.behavior_code + '  ' + behavior.behavior_desc + ' ' + behavior.behavior_id);
              } else {
                behavior.global = 0;
                behavior.org_id = this.userData.org_id;
                behavior.suborg_id = 0;
                behavior.program_id = 0;
                behavior.iteration_id = 0;
                behavior.competency_id = competencyId; // Assign the retrieved competency ID to each behavior
                
                // Generate behavior code based on the length of behaviors array
                behavior.behavior_code = this.selectedOrgCompetency.competency_code + (index + 1);
                
                // Insert new behavior
                const res = await api.post('/insert-360Behavior', behavior);
                console.log(`New behavior added successfully.`, res.data);
                console.log(behavior.behavior_code + '  ' + behavior.behavior_desc + ' ' + behavior.behavior_id);
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedOrgCompetency = {};
      } else if(str === 'GOSPI') {
         try {
            let competencyId = this.selectedGospiCompetency.competency_id;
            if (!competencyId) {
              // Insert new competency
              this.selectedGospiCompetency.global = 0;
              this.selectedGospiCompetency.org_id = this.userData.org_id;
              this.selectedGospiCompetency.suborg_id = this.selectedSubOrg.subOrgId;
              this.selectedGospiCompetency.program_id = 0;
              this.selectedGospiCompetency.iteration_id = 0;
              const competencyRes = await api.post('/insert-360Competency', this.selectedGospiCompetency);
              console.log('New competency added successfully.', competencyRes.data);
              competencyId = competencyRes.data.insertId; // Retrieve the competency ID from the response
              console.log('from database C-ID:', competencyId);
              if(competencyRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Competency Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing competency
              const res = await api.put(`/360Competency/${competencyId}`, this.selectedGospiCompetency);
              console.log(`Competency ${competencyId} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Competency Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            for (const [index, behavior] of this.selectedGospiCompetency.behaviors.entries()) {
              if (behavior.behavior_id) {
                // Update existing behavior
                behavior.behavior_code = this.selectedGospiCompetency.competency_code + (index + 1);
                const res = await api.put(`/360Behavior/${behavior.behavior_id}`, behavior);
                console.log(`Behavior ${behavior.behavior_id} updated successfully.`, res);
                console.log(behavior.behavior_code + '  ' + behavior.behavior_desc + ' ' + behavior.behavior_id);
              } else {
                behavior.global = 0;
                behavior.org_id = this.userData.org_id;
                behavior.suborg_id = this.selectedSubOrg.subOrgId;
                behavior.program_id = 0;
                behavior.iteration_id = 0;
                behavior.competency_id = competencyId; // Assign the retrieved competency ID to each behavior
                
                // Generate behavior code based on the length of behaviors array
                behavior.behavior_code = this.selectedGospiCompetency.competency_code + (index + 1);
                
                // Insert new behavior
                const res = await api.post('/insert-360Behavior', behavior);
                console.log(`New behavior added successfully.`, res.data);
                console.log(behavior.behavior_code + '  ' + behavior.behavior_desc + ' ' + behavior.behavior_id);
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGospiCompetency = {};
      } else if(str === 'GLOBAL-OEQ') {
         try {
            let oeqId = this.selectedGlobalOpenEnded.oeq_id;
            if (!oeqId) {
              // Insert new Open Ended
              this.selectedGlobalOpenEnded.global = 1;
              this.selectedGlobalOpenEnded.org_id = 0;
              this.selectedGlobalOpenEnded.suborg_id = 0;
              this.selectedGlobalOpenEnded.program_id = 0;
              this.selectedGlobalOpenEnded.iteration_id = 0;
              this.selectedGlobalOpenEnded.for_participant = this.forParticipant;
              const oeqRes = await api.post('/insert-360Oeq', this.selectedGlobalOpenEnded);
              console.log('New open-ended added successfully.', oeqRes.data);
              oeqId = oeqRes.data.insertId; // Retrieve the Open Ended ID from the response
              console.log('from database OEQ-ID:', oeqId);
              if(oeqRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Open Ended
              const res = await api.put(`/360Oeq/${oeqId}`, this.selectedGlobalOpenEnded);
              console.log(`Open-ended ${oeqId} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGlobalOpenEnded = {};
      } else if(str === 'ORG-OEQ') {
         try {
            let oeqId = this.selectedOrgOpenEnded.oeq_id;
            if (!oeqId) {
              // Insert new Open Ended
              this.selectedOrgOpenEnded.global = 0;
              this.selectedOrgOpenEnded.org_id = this.userData.org_id;
              this.selectedOrgOpenEnded.suborg_id = 0;
              this.selectedOrgOpenEnded.program_id = 0;
              this.selectedOrgOpenEnded.iteration_id = 0;
              this.selectedOrgOpenEnded.for_participant = this.forParticipant;
              const oeqRes = await api.post('/insert-360Oeq', this.selectedOrgOpenEnded);
              console.log('New open-ended added successfully.', oeqRes.data);
              oeqId = oeqRes.data.insertId; // Retrieve the Open Ended ID from the response
              console.log('from database OEQ-ID:', oeqId);
              if(oeqRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
              //insert new Open ended description
              // const oeqDescValues = {
              //   section_name: 'Open-Ended',
              //   section_description: this.selectedOrgOpenEndedDescription,
              //   added_by: this.userData.ind_id,
              //   global: '0',
              //   org_id: this.userData.org_id,
              //   suborg_id: '0',
              //   program_id: '0',
              //   iteration_id: '0'
              // }
              // const oeqDescRes = await api.post("/insert-360section",oeqDescValues)
              // console.log("OEQ Desc added",oeqDescRes)
            } else {
              // Update existing Open Ended
              const res = await api.put(`/360Oeq/${oeqId}`, this.selectedOrgOpenEnded);
              console.log(`Open-ended ${oeqId} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedOrgOpenEnded = {};
      } else if(str === 'GOSPI-OEQ') {
         try {
            let oeqId = this.selectedGospiOpenEnded.oeq_id;
            if (!oeqId) {
              // Insert new Open Ended
              this.selectedGospiOpenEnded.global = 0;
              this.selectedGospiOpenEnded.org_id = this.userData.org_id;
              this.selectedGospiOpenEnded.suborg_id = this.selectedSubOrg.subOrgId;
              this.selectedGospiOpenEnded.program_id = 0;
              this.selectedGospiOpenEnded.iteration_id = 0;
              this.selectedGospiOpenEnded.for_participant = this.forParticipant;
              const oeqRes = await api.post('/insert-360Oeq', this.selectedGospiOpenEnded);
              console.log('New open-ended added successfully.', oeqRes.data);
              oeqId = oeqRes.data.insertId; // Retrieve the Open Ended ID from the response
              console.log('from database OEQ-ID:', oeqId);
              if(oeqRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Open Ended
              const res = await api.put(`/360Oeq/${oeqId}`, this.selectedGospiOpenEnded);
              console.log(`Open-ended ${oeqId} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Open Ended Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGospiOpenEnded = {};
      } else if(str === 'GLOBAL-ORGCLIMATE') {
         try {
            let orgclimateID = this.selectedGlobalOrgClimate.org_climate_id;
            if (!orgclimateID) {
              // Insert new Org Climate
              this.selectedGlobalOrgClimate.global = 1;
              this.selectedGlobalOrgClimate.org_id = 0;
              this.selectedGlobalOrgClimate.suborg_id = 0;
              this.selectedGlobalOrgClimate.program_id = 0;
              this.selectedGlobalOrgClimate.iteration_id = 0;
              this.selectedGlobalOrgClimate.for_participant = this.forParticipant;
              const OrgClimateRes = await api.post('/insert-360OrgClimate', this.selectedGlobalOrgClimate);
              console.log('New Org-Climate added successfully.', OrgClimateRes.data);
              orgclimateID = OrgClimateRes.data.insertId; // Retrieve the Org Climate ID from the response
              console.log('from database OEQ-ID:', orgclimateID);
              if(OrgClimateRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Org Climate
              const res = await api.put(`/360OrgClimate/${orgclimateID}`, this.selectedGlobalOrgClimate);
              console.log(`Org-Climate ${orgclimateID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGlobalOrgClimate = {};
      } else if(str === 'ORG-ORGCLIMATE') {
         try {
            let orgclimateID = this.selectedOrgOrgClimate.org_climate_id;
            if (!orgclimateID) {
              // Insert new Org Climate
              this.selectedOrgOrgClimate.global = 0;
              this.selectedOrgOrgClimate.org_id = this.userData.org_id;
              this.selectedOrgOrgClimate.suborg_id = 0;
              this.selectedOrgOrgClimate.program_id = 0;
              this.selectedOrgOrgClimate.iteration_id = 0;
              this.selectedOrgOrgClimate.for_participant = this.forParticipant;
              const OrgClimateRes = await api.post('/insert-360OrgClimate', this.selectedOrgOrgClimate);
              console.log('New Org-Climate added successfully.', OrgClimateRes.data);
              orgclimateID = OrgClimateRes.data.insertId; // Retrieve the Org Climate ID from the response
              console.log('from database OEQ-ID:', orgclimateID);
              if(OrgClimateRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Org Climate
              const res = await api.put(`/360OrgClimate/${orgclimateID}`, this.selectedOrgOrgClimate);
              console.log(`Org-Climate ${orgclimateID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedOrgOrgClimate = {};
      } else if(str === 'GOSPI-ORGCLIMATE') {
         try {
            let orgclimateID = this.selectedGospiOrgClimate.org_climate_id;
            if (!orgclimateID) {
              // Insert new Org Climate
              this.selectedGospiOrgClimate.global = 0;
              this.selectedGospiOrgClimate.org_id = this.userData.org_id;
              this.selectedGospiOrgClimate.suborg_id = this.selectedSubOrg.subOrgId;
              this.selectedGospiOrgClimate.program_id = 0;
              this.selectedGospiOrgClimate.iteration_id = 0;
              this.selectedGospiOrgClimate.for_participant = this.forParticipant;
              const OrgClimateRes = await api.post('/insert-360OrgClimate', this.selectedGospiOrgClimate);
              console.log('New Org-Climate added successfully.', OrgClimateRes.data);
              orgclimateID = OrgClimateRes.data.insertId; // Retrieve the Org Climate ID from the response
              console.log('from database OEQ-ID:', orgclimateID);
              if(OrgClimateRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Org Climate
              const res = await api.put(`/360OrgClimate/${orgclimateID}`, this.selectedGospiOrgClimate);
              console.log(`Org-Climate ${orgclimateID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Org Climate Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGospiOrgClimate = {};
      } else if(str === 'GLOBAL-NETPROMOTERSCORE') {
         try {
            let NetPromoterScoreID = this.selectedGlobalNetPromoterScore.nps_id;
            if (!NetPromoterScoreID) {
              // Insert new Net Promoter Score
              this.selectedGlobalNetPromoterScore.global = 1;
              this.selectedGlobalNetPromoterScore.org_id = 0;
              this.selectedGlobalNetPromoterScore.suborg_id = 0;
              this.selectedGlobalNetPromoterScore.program_id = 0;
              this.selectedGlobalNetPromoterScore.iteration_id = 0;
              this.selectedGlobalNetPromoterScore.for_participant = this.forParticipant;
              const NetPromoterScoreRes = await api.post('/insert-360NetPromoterScore', this.selectedGlobalNetPromoterScore);
              console.log('New Net Promoter Score added successfully.', NetPromoterScoreRes.data);
              NetPromoterScoreID = NetPromoterScoreRes.data.insertId; // Retrieve the Net Promoter Score ID from the response
              console.log('from database NPS-ID:', NetPromoterScoreID);
              if(NetPromoterScoreRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Net Promoter Score
              const res = await api.put(`/360NetPromoterScore/${NetPromoterScoreID}`, this.selectedGlobalNetPromoterScore);
              console.log(`Net Promoter Score ${NetPromoterScoreID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGlobalNetPromoterScore = {};
      } else if(str === 'ORG-NETPROMOTERSCORE') {
         try {
            let NetPromoterScoreID = this.selectedOrgNetPromoterScore.nps_id;
            if (!NetPromoterScoreID) {
              // Insert new Net Promoter Score
              this.selectedOrgNetPromoterScore.global = 0;
              this.selectedOrgNetPromoterScore.org_id = this.userData.org_id;
              this.selectedOrgNetPromoterScore.suborg_id = 0;
              this.selectedOrgNetPromoterScore.program_id = 0;
              this.selectedOrgNetPromoterScore.iteration_id = 0;
              this.selectedOrgNetPromoterScore.for_participant = this.forParticipant;
              const NetPromoterScoreRes = await api.post('/insert-360NetPromoterScore', this.selectedOrgNetPromoterScore);
              console.log('New Net Promoter Score added successfully.', NetPromoterScoreRes.data);
              NetPromoterScoreID = NetPromoterScoreRes.data.insertId; // Retrieve the Net Promoter Score ID from the response
              console.log('from database NPS-ID:', NetPromoterScoreID);
              if(NetPromoterScoreRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Net Promoter Score
              const res = await api.put(`/360NetPromoterScore/${NetPromoterScoreID}`, this.selectedOrgNetPromoterScore);
              console.log(`Net Promoter Score ${NetPromoterScoreID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedOrgNetPromoterScore = {};
      } else if(str === 'GOSPI-NETPROMOTERSCORE') {
         try {
            let NetPromoterScoreID = this.selectedGospiNetPromoterScore.nps_id;
            if (!NetPromoterScoreID) {
              // Insert new Net Promoter Score
              this.selectedGospiNetPromoterScore.global = 0;
              this.selectedGospiNetPromoterScore.org_id = this.userData.org_id;
              this.selectedGospiNetPromoterScore.suborg_id = this.selectedSubOrg.subOrgId;
              this.selectedGospiNetPromoterScore.program_id = 0;
              this.selectedGospiNetPromoterScore.iteration_id = 0;
              this.selectedGospiNetPromoterScore.for_participant = this.forParticipant;
              const NetPromoterScoreRes = await api.post('/insert-360NetPromoterScore', this.selectedGospiNetPromoterScore);
              console.log('New Net Promoter Score added successfully.', NetPromoterScoreRes.data);
              NetPromoterScoreID = NetPromoterScoreRes.data.insertId; // Retrieve the Net Promoter Score ID from the response
              console.log('from database NPS-ID:', NetPromoterScoreID);
              if(NetPromoterScoreRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Net Promoter Score
              const res = await api.put(`/360NetPromoterScore/${NetPromoterScoreID}`, this.selectedGospiNetPromoterScore);
              console.log(`Net Promoter Score ${NetPromoterScoreID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Net Promoter Score Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }
            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGospiNetPromoterScore = {};
      } else if(str === 'GLOBAL-SHARINGOPTIONS') {
         try {
            let sharingoptionsID = this.selectedGlobalSharingOptions.sharing_options_id;
            if (!sharingoptionsID) {
              // Insert new Sharing Options
              this.selectedGlobalSharingOptions.global = 1;
              this.selectedGlobalSharingOptions.org_id = 0;
              this.selectedGlobalSharingOptions.suborg_id = 0;
              this.selectedGlobalSharingOptions.program_id = 0;
              this.selectedGlobalSharingOptions.iteration_id = 0;
              this.selectedGlobalSharingOptions.for_participant = this.forParticipant;
              const SharingOptionsRes = await api.post('/insert-360SharingOptions', this.selectedGlobalSharingOptions);
              console.log('New Sharing Options added successfully.', SharingOptionsRes.data);
              sharingoptionsID = SharingOptionsRes.data.insertId; // Retrieve the Sharing Options ID from the response
              console.log('from database sharingoptions-ID:', sharingoptionsID);
              if(SharingOptionsRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Sharing Options
              const res = await api.put(`/360SharingOptions/${sharingoptionsID}`, this.selectedGlobalSharingOptions);
              console.log(`Sharing Option ${sharingoptionsID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGlobalSharingOptions = {};
      } else if(str === 'ORG-SHARINGOPTIONS') {
         try {
            let sharingoptionsID = this.selectedOrgSharingOptions.sharing_options_id;
            if (!sharingoptionsID) {
              // Insert new Sharing Options
              this.selectedOrgSharingOptions.global = 0;
              this.selectedOrgSharingOptions.org_id = this.userData.org_id;
              this.selectedOrgSharingOptions.suborg_id = 0;
              this.selectedOrgSharingOptions.program_id = 0;
              this.selectedOrgSharingOptions.iteration_id = 0;
              this.selectedOrgSharingOptions.for_participant = this.forParticipant;
              const SharingOptionsRes = await api.post('/insert-360SharingOptions', this.selectedOrgSharingOptions);
              console.log('New Sharing Options added successfully.', SharingOptionsRes.data);
              sharingoptionsID = SharingOptionsRes.data.insertId; // Retrieve the Sharing Options ID from the response
              console.log('from database sharingoptions-ID:', sharingoptionsID);
              if(SharingOptionsRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Sharing Options
              const res = await api.put(`/360SharingOptions/${sharingoptionsID}`, this.selectedOrgSharingOptions);
              console.log(`Sharing Option ${sharingoptionsID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedOrgSharingOptions = {};
      } else if(str === 'GOSPI-SHARINGOPTIONS') {
         try {
            let sharingoptionsID = this.selectedGospiSharingOptions.sharing_options_id;
            if (!sharingoptionsID) {
              // Insert new Sharing Options
              this.selectedGospiSharingOptions.global = 0;
              this.selectedGospiSharingOptions.org_id = this.userData.org_id;
              this.selectedGospiSharingOptions.suborg_id = this.selectedSubOrg.subOrgId;
              this.selectedGospiSharingOptions.program_id = 0;
              this.selectedGospiSharingOptions.iteration_id = 0;
              this.selectedGospiSharingOptions.for_participant = this.forParticipant;
              const SharingOptionsRes = await api.post('/insert-360SharingOptions', this.selectedGospiSharingOptions);
              console.log('New Sharing Options added successfully.', SharingOptionsRes.data);
              sharingoptionsID = SharingOptionsRes.data.insertId; // Retrieve the Sharing Options ID from the response
              console.log('from database sharingoptions-ID:', sharingoptionsID);
              if(SharingOptionsRes.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Saved',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            } else {
              // Update existing Sharing Options
              const res = await api.put(`/360SharingOptions/${sharingoptionsID}`, this.selectedGospiSharingOptions);
              console.log(`Sharing Option ${sharingoptionsID} updated successfully.`, res);
              if(res.status === 200){
                this.isButtonDisabled = false
                Swal.fire({
                title: '',
                text: 'Sharing Option Updated',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#3085d6',
                allowOutsideClick: false,
              });
              }
            }

            const modalBOX = document.getElementById('modal');
            modalBOX.style.display = 'none';
          } catch (error) {
            console.log(error);
          }
        this.selectedGospiSharingOptions = {};
      }
      this.getLibraryData()
      document.body.style.overflow = 'auto';
    },
    async handleBorrow(str, event) {
      this.isButtonDisabled = true
      event.preventDefault();
      if (str === 'GLOBAL') {
        Swal.fire({
          text: `Are you sure you want to borrow ${this.borrowedGlobalCompetency.competency_name} from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const currentDate = new Date();
            const isoTime = currentDate.toISOString();

            try {
              const competencyRes = await api.put(`/borrow-360Competency`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                competency_id: this.borrowedGlobalCompetency.competency_id,
                date_valid_from: this.formatDateTime(isoTime),
                date_valid_to: this.borrowedGlobalCompetency.date_valid_to,
              });

              if (competencyRes.status === 200) {
                this.isButtonDisabled = false;
                console.log('Competency saving:', competencyRes);

                const insertedCompetencyId = competencyRes.data.insertedCompetencyId;

                for (const behavior of this.borrowedGlobalCompetency.behaviors) {
                  try {
                    const behaviorRes = await api.put(`/borrow-360Behavior`, {
                      global: 0,
                      org_id: this.userData.org_id,
                      suborg_id: this.selectedSubOrg.subOrgId,
                      program_id: 0,
                      iteration_id: 0,
                      competency_id: insertedCompetencyId, // Use the newly inserted competency_id here
                      behavior_id: behavior.behavior_id,
                    });
                    console.log(`Behavior ${behavior.behavior_id} borrowed successfully.`, behaviorRes);
                  } catch (error) {
                    console.log(`Error borrowing behavior ${behavior.behavior_id}:`, error);
                  }
                }

                Swal.fire({
                  title: '',
                  text: `Competency Successfully borrowed from Global to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedGlobalCompetency = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'ORG') {
        if(this.selectedSubOrg.subOrgId === 0){
              Swal.fire({
              title: '',
              text: 'You need to select a Sub-Org Library to save the competency you want to borrow',
              icon: 'info',
              confirmButtonText: 'Ok',
              confirmButtonColor: '#3085d6',
              allowOutsideClick: false,
            });
            const modalBOX = document.getElementById('modal')
            modalBOX.style.display = 'none'
            return
            }
            
            Swal.fire({
              text: `Are you sure you want to borrow ${this.borrowedOrgCompetency.competency_name} from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Ok",
              showCancelButton: true,
              cancelButtonColor: "#d33",
              cancelButtonText: "Cancel",
            }).then(async (result) => {
              if (result.isConfirmed) {
                const currentDate = new Date();
                const isoTime = currentDate.toISOString();

                try {
                  const competencyRes = await api.put(`/borrow-360Competency`, {
                    global: 0,
                    org_id: this.userData.org_id,
                    suborg_id: this.selectedSubOrg.subOrgId,
                    program_id: 0,
                    iteration_id: 0,
                    competency_id: this.borrowedOrgCompetency.competency_id,
                    date_valid_from: this.formatDateTime(isoTime),
                    date_valid_to: this.borrowedOrgCompetency.date_valid_to,
                  });

                  if (competencyRes.status === 200) {
                    this.isButtonDisabled = false;
                    console.log('Competency saving:', competencyRes);
                    const insertedCompetencyId = competencyRes.data.insertedCompetencyId;

                    for (const behavior of this.borrowedOrgCompetency.behaviors) {
                      try {
                        const behaviorRes = await api.put(`/borrow-360Behavior`, {
                          global: 0,
                          org_id: this.userData.org_id,
                          suborg_id: this.selectedSubOrg.subOrgId,
                          program_id: 0,
                          iteration_id: 0,
                          competency_id: insertedCompetencyId, // Use the newly inserted competency_id here
                          behavior_id: behavior.behavior_id,
                        });
                        console.log(`Behavior ${behavior.behavior_id} borrowed successfully.`, behaviorRes);
                      } catch (error) {
                        console.log(`Error borrowing behavior ${behavior.behavior_id}:`, error);
                      }
                    }

                    Swal.fire({
                      title: '',
                      text: `Competency Successfully borrowed from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                      icon: 'info',
                      confirmButtonText: 'Ok',
                      confirmButtonColor: '#3085d6',
                      allowOutsideClick: false,
                    });

                    const modalBOX = document.getElementById('modal');
                    modalBOX.style.display = 'none';
                  }
                } catch (error) {
                  console.log(error);
                }
                this.borrowedOrgCompetency = {};
              } else if (result.isDismissed) {
                this.isButtonDisabled = false;
              }
            });
      } else if (str === 'GLOBAL-OEQ') {
        Swal.fire({
          text: `Are you sure you want to borrow from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const openEndedRes = await api.put(`/borrow-360Oeq`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                oeq_id: this.borrowedGlobalOpenEnded.oeq_id,
              });

              if (openEndedRes.status === 200) {
                this.isButtonDisabled = false;
                console.log('Open-ended saving:', openEndedRes);

                Swal.fire({
                  title: '',
                  text: `Open-Ended Successfully borrowed from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedGlobalOpenEnded = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'ORG-OEQ') {
        Swal.fire({
          text: `Are you sure you want to borrow from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const openEndedRes = await api.put(`/borrow-360Oeq`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                oeq_id: this.borrowedOrgOpenEnded.oeq_id,
              });

              if (openEndedRes.status === 200) {
                this.isButtonDisabled = false;
                console.log('Open-ended saving:', openEndedRes);

                Swal.fire({
                  title: '',
                  text: `Open-Ended Successfully borrowed from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedOrgOpenEnded = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'GLOBAL-ORGCLIMATE') {
        Swal.fire({
          text: `Are you sure you want to borrow from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const OrgClimate = await api.put(`/borrow-360OrgClimate`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                org_climate_id: this.borrowedGlobalOrgClimate.org_climate_id,
              });

              if (OrgClimate.status === 200) {
                this.isButtonDisabled = false;
                console.log('Org-Climate saving:', OrgClimate);

                Swal.fire({
                  title: '',
                  text: `Org-Climate Successfully borrowed from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedGlobalOrgClimate = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'ORG-ORGCLIMATE') {
        Swal.fire({
          text: `Are you sure you want to borrow from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const OrgClimate = await api.put(`/borrow-360OrgClimate`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                org_climate_id: this.borrowedOrgOrgClimate.org_climate_id,
              });

              if (OrgClimate.status === 200) {
                this.isButtonDisabled = false;
                console.log('Org-Climate saving:', OrgClimate);

                Swal.fire({
                  title: '',
                  text: `Org-Climate Successfully borrowed from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedOrgOrgClimate = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'GLOBAL-NETPROMOTERSCORE') {
        Swal.fire({
          text: `Are you sure you want to borrow from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const NetPromoterScore = await api.put(`/borrow-360NetPromoterScore`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                nps_id: this.borrowedGlobalNetPromoterScore.nps_id,
              });

              if (NetPromoterScore.status === 200) {
                this.isButtonDisabled = false;
                console.log('Net Promoter Score saving:', NetPromoterScore);

                Swal.fire({
                  title: '',
                  text: `Net Promoter Score Successfully borrowed from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedGlobalNetPromoterScore = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'ORG-NETPROMOTERSCORE') {
        Swal.fire({
          text: `Are you sure you want to borrow from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const NetPromoterScore = await api.put(`/borrow-360NetPromoterScore`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                nps_id: this.borrowedOrgNetPromoterScore.nps_id,
              });

              if (NetPromoterScore.status === 200) {
                this.isButtonDisabled = false;
                console.log('Net Promoter Score saving:', NetPromoterScore);

                Swal.fire({
                  title: '',
                  text: `Net Promoter Score Successfully borrowed from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedOrgNetPromoterScore = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'GLOBAL-SHARINGOPTIONS') {
        Swal.fire({
          text: `Are you sure you want to borrow from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const SharingOptions = await api.put(`/borrow-360SharingOptions`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                sharing_options_id: this.borrowedGlobalSharingOptions.sharing_options_id,
              });

              if (SharingOptions.status === 200) {
                this.isButtonDisabled = false;
                console.log('Sharing-Options saving:', SharingOptions);

                Swal.fire({
                  title: '',
                  text: `Sharing-Options Successfully borrowed from GLOBAL to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedGlobalSharingOptions = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      } else if (str === 'ORG-SHARINGOPTIONS') {
        Swal.fire({
          text: `Are you sure you want to borrow from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
          showCancelButton: true,
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const SharingOptions = await api.put(`/borrow-360SharingOptions`, {
                global: 0,
                org_id: this.userData.org_id,
                suborg_id: this.selectedSubOrg.subOrgId,
                program_id: 0,
                iteration_id: 0,
                sharing_options_id: this.borrowedOrgSharingOptions.sharing_options_id,
              });

              if (SharingOptions.status === 200) {
                this.isButtonDisabled = false;
                console.log('Sharing-Options saving:', SharingOptions);

                Swal.fire({
                  title: '',
                  text: `Sharing-Options Successfully borrowed from ${this.org} to ${this.selectedSubOrg.subOrgId !== 0 ? this.selectedSubOrg.subOrgName : this.org}`,
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                });

                const modalBOX = document.getElementById('modal');
                modalBOX.style.display = 'none';
              }
            } catch (error) {
              console.log(error);
            }
            this.borrowedOrgSharingOptions = {};
          } else if (result.isDismissed) {
            this.isButtonDisabled = false;
          }
        });
      }
      this.getLibraryData()
      document.body.style.overflow = 'auto';
    },
    addBehavior(num, str) {
      this.behaviorModified = true;
      if(str === 'GLOBAL'){
        // Generate a new behavior object
        if (this.selectedGlobalCompetency) {
          // Create a 'behaviors' property if it doesn't exist
          if (!this.selectedGlobalCompetency.behaviors) {
            this.selectedGlobalCompetency.behaviors = [];
          }

          const num = this.selectedGlobalCompetency.behaviors.length;

          const newBehavior = {
            competency_id: this.selectedGlobalCompetency.competency_id,
            behavior_code: this.selectedGlobalCompetency.competency_code + (num + 1),
            behavior_desc: "",
            for_participant: this.forParticipant,
            is_reversed: null,
            global: this.selectedGlobalCompetency.global,
            org_id: this.selectedGlobalCompetency.org_id,
            suborg_id: this.selectedGlobalCompetency.suborg_id,
            program_id: this.selectedGlobalCompetency.program_id,
            iteration_id: this.selectedGlobalCompetency.iteration_id
          };

          // Push the behavior into the 'behaviors' array of this.selectedGlobalCompetency
          this.selectedGlobalCompetency.behaviors.push(newBehavior);
        }
      } else if(str === 'ORG') {
        // Generate a new behavior object
        if (this.selectedOrgCompetency) {
          // Create a 'behaviors' property if it doesn't exist
          if (!this.selectedOrgCompetency.behaviors) {
            this.selectedOrgCompetency.behaviors = [];
          }

          const num = this.selectedOrgCompetency.behaviors.length;

          const newBehavior = {
            competency_id: this.selectedOrgCompetency.competency_id,
            behavior_code: this.selectedOrgCompetency.competency_code + (num + 1),
            behavior_desc: "",
            for_participant: this.forParticipant,
            is_reversed: null,
            global: this.selectedOrgCompetency.global,
            org_id: this.selectedOrgCompetency.org_id,
            suborg_id: this.selectedOrgCompetency.suborg_id,
            program_id: this.selectedOrgCompetency.program_id,
            iteration_id: this.selectedOrgCompetency.iteration_id
          };

          // Push the behavior into the 'behaviors' array of this.selectedOrgCompetency
          this.selectedOrgCompetency.behaviors.push(newBehavior);
        }
      } else if(str === 'GOSPI') {
        // Generate a new behavior object
        if (this.selectedGospiCompetency) {
          // Create a 'behaviors' property if it doesn't exist
          if (!this.selectedGospiCompetency.behaviors) {
            this.selectedGospiCompetency.behaviors = [];
          }

          const num = this.selectedGospiCompetency.behaviors.length;

          const newBehavior = {
            competency_id: this.selectedGospiCompetency.competency_id,
            behavior_code: this.selectedGospiCompetency.competency_code + (num + 1),
            behavior_desc: "",
            for_participant: this.forParticipant,
            is_reversed: null,
            global: this.selectedGospiCompetency.global,
            org_id: this.selectedGospiCompetency.org_id,
            suborg_id: this.selectedGospiCompetency.suborg_id,
            program_id: this.selectedGospiCompetency.program_id,
            iteration_id: this.selectedGospiCompetency.iteration_id
          };

          // Push the behavior into the 'behaviors' array of this.selectedGospiCompetency
          this.selectedGospiCompetency.behaviors.push(newBehavior);
        }
      }

    },
    async removeBehavior(index, behavior_id, str) {
      this.behaviorModified = true;
      if(str === 'GLOBAL'){
        Swal.fire({
          text: `Are you sure you want to delete the Behavior ${index + 1}?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then(async (result) => {
          if (result.value) {
            this.selectedGlobalCompetency.behaviors.splice(index, 1);
            try {
              const res = await api.delete(`/delete-360Behavior/${behavior_id}`);
              if (res.status === 200) {
                Swal.fire({
                  title: '',
                  text: 'Behavior Deleted',
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                })
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if(str === 'ORG') {
          Swal.fire({
          text: `Are you sure you want to delete the Behavior ${index + 1}?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then(async (result) => {
          if (result.value) {
            this.selectedOrgCompetency.behaviors.splice(index, 1);
            try {
              const res = await api.delete(`/delete-360Behavior/${behavior_id}`);
              if (res.status === 200) {
                Swal.fire({
                  title: '',
                  text: 'Behavior Deleted',
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                })
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      } else if(str === 'GOSPI') {
          Swal.fire({
          text: `Are you sure you want to delete the Behavior ${index + 1}?`,
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then(async (result) => {
          if (result.value) {
            this.selectedGospiCompetency.behaviors.splice(index, 1);
            try {
              const res = await api.delete(`/delete-360Behavior/${behavior_id}`);
              if (res.status === 200) {
                Swal.fire({
                  title: '',
                  text: 'Behavior Deleted',
                  icon: 'info',
                  confirmButtonText: 'Ok',
                  confirmButtonColor: '#3085d6',
                  allowOutsideClick: false,
                })
              }
            } catch (error) {
              console.log(error);
            }
          }
        });
      }
    },
    handleViewModal(id, str) {
      this.showSaveButton = false
      this.showEditButton = true
      const modalBOX = document.getElementById('modal');
      modalBOX.style.display = 'block';
      // clear data first
        // competency
        this.selectedGlobalCompetency = null
        this.selectedOrgCompetency = null
        this.selectedGospiCompetency = null
        // open-ended
        this.selectedOrgOpenEnded = null
        this.selectedGlobalOpenEnded = null
        this.selectedGospiOpenEnded = null
        // org-climate
        this.selectedGlobalOrgClimate = null
        this.selectedOrgOrgClimate = null
        this.selectedGospiOrgClimate = null
        // net promoter score
        this.selectedGlobalNetPromoterScore = null
        this.selectedOrgNetPromoterScore = null
        this.selectedGospiNetPromoterScore = null
        // sharing options
        this.selectedGlobalSharingOptions = null
        this.selectedOrgSharingOptions = null
        this.selectedGospiSharingOptions = null
        if (str === 'GLOBAL') {
          this.selectedGlobalCompetency = this.GLOBALlibraryData.competency.find(item => item.competency_id === id);
          if (this.selectedGlobalCompetency && this.selectedGlobalCompetency.behaviors) {
            this.selectedGlobalCompetency.behaviors.sort((a, b) => a.behavior_code.localeCompare(b.behavior_code));
          }
          console.log('This is the selected global competency:', this.selectedGlobalCompetency);
        } else if (str === 'ORG') {
          this.selectedOrgCompetency = this.ORGlibraryData.competency.find(item => item.competency_id === id);
          if (this.selectedOrgCompetency && this.selectedOrgCompetency.behaviors) {
            this.selectedOrgCompetency.behaviors.sort((a, b) => a.behavior_code.localeCompare(b.behavior_code));
          }
          console.log('This is the selected org competency:', this.selectedOrgCompetency);
        } else if (str === 'GOSPI') {
          this.selectedGospiCompetency = this.GOSPIlibraryData.competency.find(item => item.competency_id === id);
          if (this.selectedGospiCompetency && this.selectedGospiCompetency.behaviors) {
            this.selectedGospiCompetency.behaviors.sort((a, b) => a.behavior_code.localeCompare(b.behavior_code));
          }
          console.log('This is the selected gospi competency:', this.selectedGospiCompetency);
        } else if (str === 'GLOBAL-OEQ') {
          this.selectedGlobalOpenEnded = this.GLOBALlibraryData.openEnded.find(item => item.oeq_id === id);
          console.log('This is the selected global open-ended:', this.selectedGlobalOpenEnded);
        } else if (str === 'ORG-OEQ') {
          this.selectedOrgOpenEnded = this.ORGlibraryData.openEnded.find(item => item.oeq_id === id);
          console.log('This is the selected org open-ended:', this.selectedOrgOpenEnded);
        } else if (str === 'GOSPI-OEQ') {
          this.selectedGospiOpenEnded = this.GOSPIlibraryData.openEnded.find(item => item.oeq_id === id);
          console.log('This is the selected gospi open-ended:', this.selectedGospiOpenEnded);
        } else if (str === 'GLOBAL-ORGCLIMATE') {
          this.selectedGlobalOrgClimate = this.GLOBALlibraryData.orgClimate.find(item => item.org_climate_id === id);
          console.log('This is the selected global org-climate:', this.selectedGlobalOrgClimate);
        } else if (str === 'ORG-ORGCLIMATE') {
          this.selectedOrgOrgClimate = this.ORGlibraryData.orgClimate.find(item => item.org_climate_id === id);
          console.log('This is the selected org org-climate:', this.selectedOrgOrgClimate);
        } else if (str === 'GOSPI-ORGCLIMATE') {
          this.selectedGospiOrgClimate = this.GOSPIlibraryData.orgClimate.find(item => item.org_climate_id === id);
          console.log('This is the selected gospi org-climate:', this.selectedGospiOrgClimate);
        } else if (str === 'GLOBAL-NETPROMOTERSCORE') {
          this.selectedGlobalNetPromoterScore = this.GLOBALlibraryData.netpromoterScore.find(item => item.nps_id === id);
          console.log('This is the selected global net promoter score:', this.selectedGlobalNetPromoterScore);
        } else if (str === 'ORG-NETPROMOTERSCORE') {
          this.selectedOrgNetPromoterScore = this.ORGlibraryData.netpromoterScore.find(item => item.nps_id === id);
          console.log('This is the selected org net promoter score:', this.selectedOrgNetPromoterScore);
        } else if (str === 'GOSPI-NETPROMOTERSCORE') {
          this.selectedGospiNetPromoterScore = this.GOSPIlibraryData.netpromoterScore.find(item => item.nps_id === id);
          console.log('This is the selected gospi net promoter score:', this.selectedGospiNetPromoterScore);
        } else if (str === 'GLOBAL-SHARINGOPTIONS') {
          this.selectedGlobalSharingOptions = this.GLOBALlibraryData.sharingOptions.find(item => item.sharing_options_id === id);
          console.log('This is the selected global sharing-options:', this.selectedGlobalsharingOptions);
        } else if (str === 'ORG-SHARINGOPTIONS') {
          this.selectedOrgSharingOptions = this.ORGlibraryData.sharingOptions.find(item => item.sharing_options_id === id);
          console.log('This is the selected org sharing-options:', this.selectedOrgsharingOptions);
        } else if (str === 'GOSPI-SHARINGOPTIONS') {
          this.selectedGospiSharingOptions = this.GOSPIlibraryData.sharingOptions.find(item => item.sharing_options_id === id);
          console.log('This is the selected gospi sharing-options:', this.selectedGospisharingOptions);
        }
      // Open the modal
      this.viewModal = true;
      this.viewBorrowedModal = false;
      document.body.style.overflow = 'hidden';
    },
    handleShowAdd(str) {
    // clear data
      // competency
      this.selectedGlobalCompetency = null
      this.selectedOrgCompetency = null
      this.selectedGospiCompetency = null
      // open-ended
      this.selectedOrgOpenEnded = null
      this.selectedGlobalOpenEnded = null
      this.selectedGospiOpenEnded = null
      // org-climate
      this.selectedGlobalOrgClimate = null
      this.selectedOrgOrgClimate = null
      this.selectedGospiOrgClimate = null
      // net promoter score
      this.selectedGlobalNetPromoterScore = null
      this.selectedOrgNetPromoterScore = null
      this.selectedGospiNetPromoterScore = null
      // sharing options
      this.selectedGlobalSharingOptions = null
      this.selectedOrgSharingOptions = null
      this.selectedGospiSharingOptions = null
      // borrow
      this.borrowedGlobalCompetency = null
      this.borrowedOrgCompetency = null
      this.borrowedGlobalOpenEnded = null
      this.borrowedOrgOpenEnded = null
      this.borrowedGlobalOrgClimate = null
      this.borrowedOrgOrgClimate = null
      this.borrowedGlobalNetPromoterScore = null
      this.borrowedOrgNetPromoterScore = null
      this.borrowedGlobalSharingOptions = null
      this.borrowedOrgSharingOptions = null
      if(str === 'GLOBAL'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGlobalCompetency = {}
        // Open the modal
      } else if(str === 'ORG') {
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedOrgCompetency = {}
        // Open the modal
      } else if(str === 'GOSPI') {
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGospiCompetency = {}
        // Open the modal
      } else if(str === 'GLOBAL-OEQ'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGlobalOpenEnded = {}
        // Open the modal
      } else if(str === 'ORG-OEQ'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedOrgOpenEnded = {}
        // Open the modal
      } else if(str === 'GOSPI-OEQ'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGospiOpenEnded = {}
        // Open the modal
      } else if(str === 'GLOBAL-ORGCLIMATE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGlobalOrgClimate = {}
        // Open the modal
      } else if(str === 'ORG-ORGCLIMATE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedOrgOrgClimate = {}
        // Open the modal
      } else if(str === 'GOSPI-ORGCLIMATE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGospiOrgClimate = {}
        // Open the modal
      } else if(str === 'GLOBAL-NETPROMOTERSCORE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGlobalNetPromoterScore = {}
        // Open the modal
      } else if(str === 'ORG-NETPROMOTERSCORE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedOrgNetPromoterScore = {}
        // Open the modal
      } else if(str === 'GOSPI-NETPROMOTERSCORE'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGospiNetPromoterScore = {}
        // Open the modal
      } else if(str === 'GLOBAL-SHARINGOPTIONS'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGlobalSharingOptions = {}
        // Open the modal
      } else if(str === 'ORG-SHARINGOPTIONS'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedOrgSharingOptions = {}
        // Open the modal
      } else if(str === 'GOSPI-SHARINGOPTIONS'){
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'block';
        this.selectedGospiSharingOptions = {}
        // Open the modal
      }      
      this.viewBorrowedModal = false;
      this.viewModal = true;
      document.body.style.overflow = 'hidden';
      console.log("Gospi Description",{
        selectedGlobalCompetencyDescription: this.selectedGospiCompetencyDescription,
        selectedGospiNetPromoterScoreDescription: this.selectedGospiNetPromoterScoreDescription,
        selectedGospiOpenEndedDescription: this.selectedGospiOpenEndedDescription,
        selectedGospiOrgClimateDescription: this.selectedGospiOrgClimateDescription,
        selectedGospiSharingOptionsDescription: this.selectedGospiSharingOptionsDescription
      })
    },
    async handleShowBorrow(id, str){
      const modalBOX = document.getElementById('modal');
      modalBOX.style.display = 'block';
      // clear data
        // comeptency
        this.borrowedGlobalCompetency = null
        this.borrowedOrgCompetency = null
        // open-ended
        this.borrowedOrgOpenEnded = null
        this.borrowedGlobalOpenEnded = null
        // org-climate
        this.borrowedGlobalOrgClimate = null
        this.borrowedOrgOrgClimate = null
        // net promoter score
        this.borrowedGlobalNetPromoterScore = null
        this.borrowedOrgNetPromoterScore = null
        // sharing options
        this.borrowedGlobalSharingOptions= null
        this.borrowedOrgSharingOptions= null
      if (str === 'GLOBAL') {
          this.borrowedGlobalCompetency = { ...this.GLOBALlibraryData.competency.find(item => item.competency_id === id) };
          try {
            const behaviorsRes = await api.post(`/360BehaviorByCompID`, {
              competency_id: this.borrowedGlobalCompetency.competency_id,
              global: this.borrowedGlobalCompetency.global,
              org_id: this.borrowedGlobalCompetency.org_id,
              suborg_id: this.borrowedGlobalCompetency.suborg_id,
              program_id: 0,
              iteration_id: 0,
            });
              if(behaviorsRes.status === 200){
                console.log('participant + nominee behaviors : ', behaviorsRes.data)
                this.borrowedGlobalCompetency.behaviors = behaviorsRes.data
              }
          } catch (error) {
            console.log(error)
          }
          if (this.borrowedGlobalCompetency && this.borrowedGlobalCompetency.behaviors) {
            this.borrowedGlobalCompetency.behaviors.sort((a, b) => {
              const participantComparison = b.for_participant - a.for_participant;
                
              if (participantComparison !== 0) {
                // If the participants are different, sort by for_participant in descending order (1 first, then 0)
                return participantComparison;
              } else {
                // If the participants are the same, sort by behavior_code in ascending order
                return a.behavior_code.localeCompare(b.behavior_code);
              }
            });
          }
          const currentDate = new Date();
          const isoTime = currentDate.toISOString()
          this.borrowedGlobalCompetency.date_valid_from = isoTime
          this.borrowedGlobalCompetency.date_valid_to = ''
          console.log('This is to borrow global competency:', this.borrowedGlobalCompetency);
          console.log('test', this.GLOBALlibraryData)
      } else if (str === 'ORG') {
        this.borrowedOrgCompetency = { ...this.ORGlibraryData.competency.find(item => item.competency_id === id) };
        try {
            const behaviorsRes = await api.post(`/360BehaviorByCompID`, {
              competency_id: this.borrowedOrgCompetency.competency_id,
              global: this.borrowedOrgCompetency.global,
              org_id: this.borrowedOrgCompetency.org_id,
              suborg_id: this.borrowedOrgCompetency.suborg_id,
              program_id: 0,
              iteration_id: 0,
            });
              if(behaviorsRes.status === 200){
                console.log('participant + nominee behaviors : ', behaviorsRes.data)
                this.borrowedOrgCompetency.behaviors = behaviorsRes.data
              }
          } catch (error) {
            console.log(error)
          }
          
        if (this.borrowedOrgCompetency && this.borrowedOrgCompetency.behaviors) {
          this.borrowedOrgCompetency.behaviors.sort((a, b) => {
            const participantComparison = b.for_participant - a.for_participant;

            if (participantComparison !== 0) {
              // If the participants are different, sort by for_participant in descending order (1 first, then 0)
              return participantComparison;
            } else {
              // If the participants are the same, sort by behavior_code in ascending order
              return a.behavior_code.localeCompare(b.behavior_code);
            }
          });
        }

        const currentDate = new Date();
        const isoTime = currentDate.toISOString()
        this.borrowedOrgCompetency.date_valid_from = isoTime
        this.borrowedOrgCompetency.date_valid_to = ''
        console.log('This is to borrow org competency:', this.borrowedOrgCompetency);
        console.log('test', this.ORGlibraryData)
      } else if (str === 'GLOBAL-OEQ') {
          this.borrowedGlobalOpenEnded = { ...this.GLOBALlibraryData.openEnded.find(item => item.oeq_id === id) };
          console.log('This is the borrowed global open-ended:', this.borrowedGlobalOpenEnded);
      } else if (str === 'ORG-OEQ') {
          this.borrowedOrgOpenEnded = { ...this.ORGlibraryData.openEnded.find(item => item.oeq_id === id) };
          console.log('This is the borrowed org open-ended:', this.borrowedOrgOpenEnded);
      } else if (str === 'GLOBAL-ORGCLIMATE') {
          this.borrowedGlobalOrgClimate = { ...this.GLOBALlibraryData.orgClimate.find(item => item.org_climate_id === id) };
          console.log('This is the borrowed global org-climate:', this.borrowedGlobalOrgClimate);
      } else if (str === 'ORG-ORGCLIMATE') {
          this.borrowedOrgOrgClimate = { ...this.ORGlibraryData.orgClimate.find(item => item.org_climate_id === id) };
          console.log('This is the borrowed global org-climate:', this.borrowedOrgOrgClimate);
      } else if (str === 'GLOBAL-NETPROMOTERSCORE') {
          this.borrowedGlobalNetPromoterScore = { ...this.GLOBALlibraryData.netpromoterScore.find(item => item.nps_id === id) };
          console.log('This is the borrowed global net promoter score:', this.borrowedGlobalNetPromoterScore);
      } else if (str === 'ORG-NETPROMOTERSCORE') {
          this.borrowedOrgNetPromoterScore = { ...this.ORGlibraryData.netpromoterScore.find(item => item.nps_id === id) };
          console.log('This is the borrowed org net promoter score:', this.borrowedOrgNetPromoterScore);
      } else if (str === 'GLOBAL-SHARINGOPTIONS') {
          this.borrowedGlobalSharingOptions = { ...this.GLOBALlibraryData.sharingOptions.find(item => item.sharing_options_id === id) };
          console.log('This is the borrowed global sharing-options:', this.borrowedGlobalSharingOptions);
      } else if (str === 'ORG-SHARINGOPTIONS') {
          this.borrowedOrgSharingOptions = { ...this.ORGlibraryData.sharingOptions.find(item => item.sharing_options_id === id) };
          console.log('This is the borrowed org sharing-options:', this.borrowedOrgSharingOptions);
      }
      this.viewBorrowedModal = true;
      this.viewModal = false;
      document.body.style.overflow = 'hidden';
    },
    handleEdit() {
      this.showEditButton = false;
      this.showSaveButton = true;
    },
    handleCancel() {
      this.showEditButton = true;
      this.showSaveButton = false;
    },
    sortByHeader(header, arr) {
      console.log(arr)
      // Determine the sort direction based on whether the header is currently sorted
      if (this.sortColumn === header) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = header
        this.sortDirection = 'asc'
      }

      // Use the sort() method of the array to sort the data based on the current sort column and direction
      arr.sort((a, b) => {
        if (a[header] < b[header]) {
          return this.sortDirection === 'asc' ? -1 : 1
        }
        if (a[header] > b[header]) {
          return this.sortDirection === 'asc' ? 1 : -1
        }
        return 0
      })
    },
    hideModal(event) {
      if (event.target === event.currentTarget) {
        const modalBOX = document.getElementById('modal')
        modalBOX.style.display = 'none'
        this.showEditButton = true;
        this.showSaveButton = false;
        document.body.style.overflow = 'auto';
      }
    },
    toggleAccordion(String) {
      if (String === 'Competency') {
        this.competencyAccordion = !this.competencyAccordion
        const accordion = document.getElementById('accordion-competency-global')
        if (this.competencyAccordion == true) {
          accordion.style.border = '2px solid #f47820'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OpenEnded') {
        this.openEndedAccordion = !this.openEndedAccordion
        const accordion = document.getElementById('accordion-openended-global')
        if (this.openEndedAccordion == true) {
          accordion.style.border = '2px solid #f47820'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OrgClimate') {
        this.orgclimateAccordion = !this.orgclimateAccordion
        const accordion = document.getElementById('accordion-orgclimate-global')
        if (this.orgclimateAccordion == true) {
          accordion.style.border = '2px solid #f47820'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'NetPromoterScore') {
        this.netpromoterScoreAccordion = !this.netpromoterScoreAccordion
        const accordion = document.getElementById(
          'accordion-netpromoterscore-global'
        )
        if (this.netpromoterScoreAccordion == true) {
          accordion.style.border = '2px solid #f47820'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'ShareOptions') {
        this.shareoptionsAccordion = !this.shareoptionsAccordion
        const accordion = document.getElementById(
          'accordion-shareoptions-global'
        )
        if (this.shareoptionsAccordion == true) {
          accordion.style.border = '2px solid #f47820'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'CompetencyORG') {
        this.competencyAccordionORG = !this.competencyAccordionORG
        const accordion = document.getElementById('accordion-competency-org')
        if (this.competencyAccordionORG == true) {
          accordion.style.border = '2px solid #0e5071'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OpenEndedORG') {
        this.openEndedAccordionORG = !this.openEndedAccordionORG
        const accordion = document.getElementById('accordion-openended-org')
        if (this.openEndedAccordionORG == true) {
          accordion.style.border = '2px solid #0e5071'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OrgClimateORG') {
        this.orgclimateAccordionORG = !this.orgclimateAccordionORG
        const accordion = document.getElementById('accordion-orgclimate-org')
        if (this.orgclimateAccordionORG == true) {
          accordion.style.border = '2px solid #0e5071'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'NetPromoterScoreORG') {
        this.netpromoterScoreAccordionORG = !this.netpromoterScoreAccordionORG
        const accordion = document.getElementById(
          'accordion-netpromoterscore-org'
        )
        if (this.netpromoterScoreAccordionORG == true) {
          accordion.style.border = '2px solid #0e5071'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'ShareOptionsORG') {
        this.shareoptionsAccordionORG = !this.shareoptionsAccordionORG
        const accordion = document.getElementById('accordion-shareoptions-org')
        if (this.shareoptionsAccordionORG == true) {
          accordion.style.border = '2px solid #0e5071'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'CompetencyGOSPI') {
        this.competencyAccordionGOSPI = !this.competencyAccordionGOSPI
        const accordion = document.getElementById('accordion-competency-gospi')
        if (this.competencyAccordionGOSPI == true) {
          accordion.style.border = '2px solid #b2c225'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OpenEndedGOSPI') {
        this.openEndedAccordionGOSPI = !this.openEndedAccordionGOSPI
        const accordion = document.getElementById('accordion-openended-gospi')
        if (this.openEndedAccordionGOSPI == true) {
          accordion.style.border = '2px solid #b2c225'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'OrgClimateGOSPI') {
        this.orgclimateAccordionGOSPI = !this.orgclimateAccordionGOSPI
        const accordion = document.getElementById('accordion-orgclimate-gospi')
        if (this.orgclimateAccordionGOSPI == true) {
          accordion.style.border = '2px solid #b2c225'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'NetPromoterScoreGOSPI') {
        this.netpromoterScoreAccordionGOSPI = !this.netpromoterScoreAccordionGOSPI
        const accordion = document.getElementById(
          'accordion-netpromoterscore-gospi'
        )
        if (this.netpromoterScoreAccordionGOSPI == true) {
          accordion.style.border = '2px solid #b2c225'
        } else {
          accordion.style.border = '1px solid grey'
        }
      } else if (String === 'ShareOptionsGOSPI') {
        this.shareoptionsAccordionGOSPI = !this.shareoptionsAccordionGOSPI
        const accordion = document.getElementById(
          'accordion-shareoptions-gospi'
        )
        if (this.shareoptionsAccordionGOSPI == true) {
          accordion.style.border = '2px solid #b2c225'
        } else {
          accordion.style.border = '1px solid grey'
        }
      }
    },
  },
  computed: {
    ciiGLOBALSectionDescription: {
      get() {
        return this.GLOBALSectionDescriptionData.cii?.section_description || '';
      },
      set(newValue) {
        this.GLOBALSectionDescriptionData.cii = this.GLOBALSectionDescriptionData.cii || {};
        this.GLOBALSectionDescriptionData.cii.section_description = newValue;
      }
    },

    oeqGLOBALSectionDescription: {
      get() {
        return this.GLOBALSectionDescriptionData.oeq?.section_description || '';
      },
      set(newValue) {
        this.GLOBALSectionDescriptionData.oeq = this.GLOBALSectionDescriptionData.oeq || {};
        this.GLOBALSectionDescriptionData.oeq.section_description = newValue;
      }
    },

    orgclimateGLOBALSectionDescription: {
      get() {
        return this.GLOBALSectionDescriptionData.orgclimate?.section_description || '';
      },
      set(newValue) {
        this.GLOBALSectionDescriptionData.orgclimate = this.GLOBALSectionDescriptionData.orgclimate || {};
        this.GLOBALSectionDescriptionData.orgclimate.section_description = newValue;
      }
    },

    npsGLOBALSectionDescription: {
      get() {
        return this.GLOBALSectionDescriptionData.nps?.section_description || '';
      },
      set(newValue) {
        this.GLOBALSectionDescriptionData.nps = this.GLOBALSectionDescriptionData.nps || {};
        this.GLOBALSectionDescriptionData.nps.section_description = newValue;
      }
    },

    sharingoptionsGLOBALSectionDescription: {
      get() {
        return this.GLOBALSectionDescriptionData.sharingoptions?.section_description || '';
      },
      set(newValue) {
        this.GLOBALSectionDescriptionData.sharingoptions = this.GLOBALSectionDescriptionData.sharingoptions || {};
        this.GLOBALSectionDescriptionData.sharingoptions.section_description = newValue;
      }
    },

    ciiORGSectionDescription: {
      get() {
        return this.ORGSectionDescriptionData.cii?.section_description || '';
      },
      set(newValue) {
        this.ORGSectionDescriptionData.cii = this.ORGSectionDescriptionData.cii || {};
        this.ORGSectionDescriptionData.cii.section_description = newValue;
      }
    },

    oeqORGSectionDescription: {
      get() {
        return this.ORGSectionDescriptionData.oeq?.section_description || '';
      },
      set(newValue) {
        this.ORGSectionDescriptionData.oeq = this.ORGSectionDescriptionData.oeq || {};
        this.ORGSectionDescriptionData.oeq.section_description = newValue;
      }
    },

    orgclimateORGSectionDescription: {
      get() {
        return this.ORGSectionDescriptionData.orgclimate?.section_description || '';
      },
      set(newValue) {
        this.ORGSectionDescriptionData.orgclimate = this.ORGSectionDescriptionData.orgclimate || {};
        this.ORGSectionDescriptionData.orgclimate.section_description = newValue;
      }
    },

    npsORGSectionDescription: {
      get() {
        return this.ORGSectionDescriptionData.nps?.section_description || '';
      },
      set(newValue) {
        this.ORGSectionDescriptionData.nps = this.ORGSectionDescriptionData.nps || {};
        this.ORGSectionDescriptionData.nps.section_description = newValue;
      }
    },

    sharingoptionsORGSectionDescription: {
      get() {
        return this.ORGSectionDescriptionData.sharingoptions?.section_description || '';
      },
      set(newValue) {
        this.ORGSectionDescriptionData.sharingoptions = this.ORGSectionDescriptionData.sharingoptions || {};
        this.ORGSectionDescriptionData.sharingoptions.section_description = newValue;
      }
    },

    ciiGOSPISectionDescription: {
      get() {
        return this.GOSPISectionDescriptionData.cii?.section_description || '';
      },
      set(newValue) {
        this.GOSPISectionDescriptionData.cii = this.GOSPISectionDescriptionData.cii || {};
        this.GOSPISectionDescriptionData.cii.section_description = newValue;
      }
    },

    oeqGOSPISectionDescription: {
      get() {
        return this.GOSPISectionDescriptionData.oeq?.section_description || '';
      },
      set(newValue) {
        this.GOSPISectionDescriptionData.oeq = this.GOSPISectionDescriptionData.oeq || {};
        this.GOSPISectionDescriptionData.oeq.section_description = newValue;
      }
    },

    orgclimateGOSPISectionDescription: {
      get() {
        return this.GOSPISectionDescriptionData.orgclimate?.section_description || '';
      },
      set(newValue) {
        this.GOSPISectionDescriptionData.orgclimate = this.GOSPISectionDescriptionData.orgclimate || {};
        this.GOSPISectionDescriptionData.orgclimate.section_description = newValue;
      }
    },

    npsGOSPISectionDescription: {
      get() {
        return this.GOSPISectionDescriptionData.nps?.section_description || '';
      },
      set(newValue) {
        this.GOSPISectionDescriptionData.nps = this.GOSPISectionDescriptionData.nps || {};
        this.GOSPISectionDescriptionData.nps.section_description = newValue;
      }
    },
    sharingoptionsGOSPISectionDescription: {
      get() {
        return this.GOSPISectionDescriptionData.sharingoptions?.section_description || '';
      },
      set(newValue) {
        this.GOSPISectionDescriptionData.sharingoptions = this.GOSPISectionDescriptionData.sharingoptions || {};
        this.GOSPISectionDescriptionData.sharingoptions.section_description = newValue;
      }
    },
    getGlobalCompetencyBorrowTitle() {
      if (this.borrowedGlobalCompetency.global === 1 && this.selectedSubOrg.subOrgId === 0) {
        return 'Borrow from Global Library to Org ' + this.org + ' Library'
      } else if (this.borrowedGlobalCompetency.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
        return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
      } else if (this.borrowedGlobalCompetency.global === 0 && this.selectedSubOrg) {
        return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
      } else {
        return '';
      }
    },
    getOrgCompetencyBorrowTitle() {
        if (this.borrowedOrgCompetency.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedOrgCompetency.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedOrgCompetency.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getGlobalOpenEndedBorrowTitle() {
        if (this.borrowedGlobalOpenEnded.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedGlobalOpenEnded.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedGlobalOpenEnded.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getOrgOpenEndedBorrowTitle() {
        if (this.borrowedOrgOpenEnded.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedOrgOpenEnded.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedOrgOpenEnded.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getGlobalOrgClimateBorrowTitle() {
        if (this.borrowedGlobalOrgClimate.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedGlobalOrgClimate.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedGlobalOrgClimate.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getOrgOrgClimateBorrowTitle() {
        if (this.borrowedOrgOrgClimate.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedOrgOrgClimate.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedOrgOrgClimate.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getGlobalNetPromoterScoreBorrowTitle() {
        if (this.borrowedGlobalNetPromoterScore.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedGlobalNetPromoterScore.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedGlobalNetPromoterScore.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getOrgNetPromoterScoreBorrowTitle() {
        if (this.borrowedOrgNetPromoterScore.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedOrgNetPromoterScore.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedOrgNetPromoterScore.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getGlobalSharingOptionsBorrowTitle() {
        if (this.borrowedGlobalSharingOptions.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedGlobalSharingOptions.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedGlobalSharingOptions.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
    getOrgSharingOptionsBorrowTitle() {
        if (this.borrowedOrgSharingOptions.global === 1 && this.selectedSubOrg.subOrgId === 0) {
          return 'Borrow from Global Library to Org ' + this.org + ' Library'
        } else if (this.borrowedOrgSharingOptions.global === 1 && this.selectedSubOrg.subOrgId !== 0) {
          return 'Borrow from Global Library to Sub-Org ' + this.selectedSubOrg.subOrgName + ' Library'
        } else if (this.borrowedOrgSharingOptions.org_id === this.userData.org_id && this.selectedSubOrg) {
          return `Borrow from ${this.org} to Sub-Org ` + this.selectedSubOrg.subOrgName + ' Library'
        } else {
          return '';
        }
    },
  //Competency
    filteredGLOBALCompetency() {
      if (!this.GLOBALlibraryData || !this.GLOBALlibraryData.competency) {
        return [];
      }
      const searchGlobalCompetency = this.searchGlobalCompetency ? this.searchGlobalCompetency.toLowerCase().trim() : '';
      const searchGlobalDesc = this.searchGlobalCompetencyDesc ? this.searchGlobalCompetencyDesc.toLowerCase().trim() : '';
      const searchGlobalCode = this.searchGlobalCompetencyCode ? this.searchGlobalCompetencyCode.toLowerCase().trim() : '';
      const searchGlobalStatus = this.searchGlobalCompetencyStatus ? this.searchGlobalCompetencyStatus.toLowerCase().trim() : '';
      const searchGlobalSource = this.searchGlobalCompetencySource ? this.searchGlobalCompetencySource.toLowerCase().trim() : '';
      const searchGlobalAddedBy = this.searchGlobalCompetencyAddedBy ? this.searchGlobalCompetencyAddedBy.toLowerCase().trim() : '';
      const searchGlobalDatesValidFrom = this.searchGlobalCompetencyDatesValidFrom ? new Date(this.searchGlobalCompetencyDatesValidFrom) : null;
      const searchGlobalDatesValidTo = this.searchGlobalCompetencyDatesValidTo ? new Date(this.searchGlobalCompetencyDatesValidTo) : null;
      const searchGlobalParticipantLevel = this.searchGlobalCompetencyParticipantLevel ? this.searchGlobalCompetencyParticipantLevel.toLowerCase().trim() : '';
      const searchGlobalLanguage = this.searchGlobalCompetencyLanguage ? this.searchGlobalCompetencyLanguage.toLowerCase().trim() : '';

      return this.GLOBALlibraryData.competency.filter(item =>
        (searchGlobalCompetency === "" || (item.competency_name?.toLowerCase() ?? '').includes(searchGlobalCompetency)) &&
        (searchGlobalDesc === "" || (item.competency_desc?.toLowerCase() ?? '').includes(searchGlobalDesc)) &&
        (searchGlobalCode === "" || (item.competency_code?.toLowerCase() ?? '').includes(searchGlobalCode)) &&
        (searchGlobalStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGlobalStatus)) &&
        (searchGlobalSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGlobalSource)) &&
        (searchGlobalAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGlobalAddedBy)) &&
        ((searchGlobalDatesValidFrom === null && searchGlobalDatesValidTo === null) || (item.date_valid_from && item.date_valid_to && this.isWithinDateRange(item.date_valid_from, item.date_valid_to, searchGlobalDatesValidFrom, searchGlobalDatesValidTo))) &&
        (searchGlobalParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGlobalParticipantLevel)) &&
        (searchGlobalLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGlobalLanguage))
      );
    },
    filteredORGCompetency() {
      if (!this.ORGlibraryData || !this.ORGlibraryData.competency) {
          return [];
        }
      const searchOrgCompetency = this.searchGlobalCompetency ? this.searchGlobalCompetency.toLowerCase().trim() : '';
      const searchOrgDesc = this.searchGlobalCompetencyDesc ? this.searchGlobalCompetencyDesc.toLowerCase().trim() : '';
      const searchOrgCode = this.searchGlobalCompetencyCode ? this.searchGlobalCompetencyCode.toLowerCase().trim() : '';
      const searchOrgStatus = this.searchGlobalCompetencyStatus ? this.searchGlobalCompetencyStatus.toLowerCase().trim() : '';
      const searchOrgSource = this.searchGlobalCompetencySource ? this.searchGlobalCompetencySource.toLowerCase().trim() : '';
      const searchOrgAddedBy = this.searchGlobalCompetencyAddedBy ? this.searchGlobalCompetencyAddedBy.toLowerCase().trim() : '';
      const searchOrgDatesValidFrom = this.searchGlobalCompetencyDatesValidFrom ? new Date(this.searchGlobalCompetencyDatesValidFrom) : null;
      const searchOrgDatesValidTo = this.searchGlobalCompetencyDatesValidTo ? new Date(this.searchGlobalCompetencyDatesValidTo) : null;
      const searchOrgParticipantLevel = this.searchGlobalCompetencyParticipantLevel ? this.searchGlobalCompetencyParticipantLevel.toLowerCase().trim() : '';
      const searchOrgLanguage = this.searchGlobalCompetencyLanguage ? this.searchGlobalCompetencyLanguage.toLowerCase().trim() : '';

      return this.ORGlibraryData.competency.filter(item =>
        (searchOrgCompetency === "" || (item.competency_name?.toLowerCase() ?? '').includes(searchOrgCompetency)) &&
        (searchOrgDesc === "" || (item.competency_desc?.toLowerCase() ?? '').includes(searchOrgDesc)) &&
        (searchOrgCode === "" || (item.competency_code?.toLowerCase() ?? '').includes(searchOrgCode)) &&
        (searchOrgStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchOrgStatus)) &&
        (searchOrgSource === "" || (item.source?.toLowerCase() ?? '').includes(searchOrgSource)) &&
        (searchOrgAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchOrgAddedBy)) &&
        ((!searchOrgDatesValidFrom && !searchOrgDatesValidTo) || (item.date_valid_from && item.date_valid_to && this.isWithinDateRange(item.date_valid_from, item.date_valid_to, searchOrgDatesValidFrom, searchOrgDatesValidTo))) && // Check if item's date falls within the range
        (searchOrgParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchOrgParticipantLevel)) &&
        (searchOrgLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchOrgLanguage))
      );
    },
    filteredGOSPICompetency() {
      if (!this.GOSPIlibraryData || !this.GOSPIlibraryData.competency) {
          return [];
        }
      const searchGospiCompetency = this.searchGlobalCompetency ? this.searchGlobalCompetency.toLowerCase().trim() : '';
      const searchGospiDesc = this.searchGlobalCompetencyDesc ? this.searchGlobalCompetencyDesc.toLowerCase().trim() : '';
      const searchGospiCode = this.searchGlobalCompetencyCode ? this.searchGlobalCompetencyCode.toLowerCase().trim() : '';
      const searchGospiStatus = this.searchGlobalCompetencyStatus ? this.searchGlobalCompetencyStatus.toLowerCase().trim() : '';
      const searchGospiSource = this.searchGlobalCompetencySource ? this.searchGlobalCompetencySource.toLowerCase().trim() : '';
      const searchGospiAddedBy = this.searchGlobalCompetencyAddedBy ? this.searchGlobalCompetencyAddedBy.toLowerCase().trim() : '';
      const searchGospiDatesValidFrom = this.searchGlobalCompetencyDatesValidFrom ? new Date(this.searchGlobalCompetencyDatesValidFrom) : null;
      const searchGospiDatesValidTo = this.searchGlobalCompetencyDatesValidTo ? new Date(this.searchGlobalCompetencyDatesValidTo) : null;
      const searchGospiParticipantLevel = this.searchGlobalCompetencyParticipantLevel ? this.searchGlobalCompetencyParticipantLevel.toLowerCase().trim() : '';
      const searchGospiLanguage = this.searchGlobalCompetencyLanguage ? this.searchGlobalCompetencyLanguage.toLowerCase().trim() : '';

      return this.GOSPIlibraryData.competency.filter(item =>
        (searchGospiCompetency === "" || (item.competency_name?.toLowerCase() ?? '').includes(searchGospiCompetency)) &&
        (searchGospiDesc === "" || (item.competency_desc?.toLowerCase() ?? '').includes(searchGospiDesc)) &&
        (searchGospiCode === "" || (item.competency_code?.toLowerCase() ?? '').includes(searchGospiCode)) &&
        (searchGospiStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGospiStatus)) &&
        (searchGospiSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGospiSource)) &&
        (searchGospiAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGospiAddedBy)) &&
        ((!searchGospiDatesValidFrom && !searchGospiDatesValidTo) || (item.date_valid_from && item.date_valid_to && this.isWithinDateRange(item.date_valid_from, item.date_valid_to, searchGospiDatesValidFrom, searchGospiDatesValidTo))) && // Check if item's date falls within the range
        (searchGospiParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGospiParticipantLevel)) &&
        (searchGospiLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGospiLanguage))
      );
    },
  //Oeq
    filteredGlobalOeq() {
      if (!this.GLOBALlibraryData || !this.GLOBALlibraryData.openEnded) {
            return [];
          }
        const searchGlobalOeq = this.searchGlobalOeq ? this.searchGlobalOeq.toLowerCase().trim() : '';
        const searchGlobalStatus = this.searchGlobalOeqStatus ? this.searchGlobalOeqStatus.toLowerCase().trim() : '';
        const searchGlobalParticipantLevel = this.searchGlobalOeqParticipantLevel ? this.searchGlobalOeqParticipantLevel.toLowerCase().trim() : '';
        const searchGlobalSource = this.searchGlobalOeqSource ? this.searchGlobalOeqSource.toLowerCase().trim() : '';
        const searchGlobalAddedBy = this.searchGlobalOeqAddedBy ? this.searchGlobalOeqAddedBy.toLowerCase().trim() : '';
        const searchGlobalLanguage = this.searchGlobalOeqLanguage ? this.searchGlobalOeqLanguage.toLowerCase().trim() : '';

        return this.GLOBALlibraryData.openEnded.filter(item =>
          (searchGlobalOeq === "" || (item.question?.toLowerCase() ?? '').includes(searchGlobalOeq)) &&
          (searchGlobalStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGlobalStatus)) &&
          (searchGlobalParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGlobalParticipantLevel)) &&
          (searchGlobalSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGlobalSource)) &&
          (searchGlobalAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGlobalAddedBy)) &&
          (searchGlobalLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGlobalLanguage))
          )
    },
    filteredOrgOeq() {
      if (!this.ORGlibraryData || !this.ORGlibraryData.openEnded) {
            return [];
          }
        const searchOrgOeq = this.searchOrgOeq ? this.searchOrgOeq.toLowerCase().trim() : '';
        const searchOrgStatus = this.searchOrgOeqStatus ? this.searchOrgOeqStatus.toLowerCase().trim() : '';
        const searchOrgParticipantLevel = this.searchOrgOeqParticipantLevel ? this.searchOrgOeqParticipantLevel.toLowerCase().trim() : '';
        const searchOrgSource = this.searchOrgOeqSource ? this.searchOrgOeqSource.toLowerCase().trim() : '';
        const searchOrgAddedBy = this.searchOrgOeqAddedBy ? this.searchOrgOeqAddedBy.toLowerCase().trim() : '';
        const searchOrgLanguage = this.searchOrgOeqLanguage ? this.searchOrgOeqLanguage.toLowerCase().trim() : '';

        return this.ORGlibraryData.openEnded.filter(item =>
          (searchOrgOeq === "" || (item.question?.toLowerCase() ?? '').includes(searchOrgOeq)) &&
          (searchOrgStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchOrgStatus)) &&
          (searchOrgParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchOrgParticipantLevel)) &&
          (searchOrgSource === "" || (item.source?.toLowerCase() ?? '').includes(searchOrgSource)) &&
          (searchOrgAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchOrgAddedBy)) &&
          (searchOrgLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchOrgLanguage))
          )
    },
    filteredGospiOeq() {
      if (!this.GOSPIlibraryData || !this.GOSPIlibraryData.openEnded) {
            return [];
          }
        const searchGospiOeq = this.searchGospiOeq ? this.searchGospiOeq.toLowerCase().trim() : '';
        const searchGospiStatus = this.searchGospiOeqStatus ? this.searchGospiOeqStatus.toLowerCase().trim() : '';
        const searchGospiParticipantLevel = this.searchGospiOeqParticipantLevel ? this.searchGospiOeqParticipantLevel.toLowerCase().trim() : '';
        const searchGospiSource = this.searchGospiOeqSource ? this.searchGospiOeqSource.toLowerCase().trim() : '';
        const searchGospiAddedBy = this.searchGospiOeqAddedBy ? this.searchGospiOeqAddedBy.toLowerCase().trim() : '';
        const searchGospiLanguage = this.searchGospiOeqLanguage ? this.searchGospiOeqLanguage.toLowerCase().trim() : '';

        return this.GOSPIlibraryData.openEnded.filter(item =>
          (searchGospiOeq === "" || (item.question?.toLowerCase() ?? '').includes(searchGospiOeq)) &&
          (searchGospiStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGospiStatus)) &&
          (searchGospiParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGospiParticipantLevel)) &&
          (searchGospiSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGospiSource)) &&
          (searchGospiAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGospiAddedBy)) &&
          (searchGospiLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGospiLanguage))
          )
    },
  //OrgClimate
    filteredGlobalOrgClimate() {
      if (!this.GLOBALlibraryData || !this.GLOBALlibraryData.orgClimate) {
          return [];
        }
        const searchGlobalOrgClimate = this.searchGlobalOrgClimate ? this.searchGlobalOrgClimate.toLowerCase().trim() : '';
        const searchGlobalStatus = this.searchGlobalOrgClimateStatus ? this.searchGlobalOrgClimateStatus.toLowerCase().trim() : '';
        const searchGlobalParticipantLevel = this.searchGlobalOrgClimateParticipantLevel ? this.searchGlobalOrgClimateParticipantLevel.toLowerCase().trim() : '';
        const searchGlobalSource = this.searchGlobalOrgClimateSource ? this.searchGlobalOrgClimateSource.toLowerCase().trim() : '';
        const searchGlobalAddedBy = this.searchGlobalOrgClimateAddedBy ? this.searchGlobalOrgClimateAddedBy.toLowerCase().trim() : '';
        const searchGlobalLanguage = this.searchGlobalOrgClimateLanguage ? this.searchGlobalOrgClimateLanguage.toLowerCase().trim() : '';

        return this.GLOBALlibraryData.orgClimate.filter(item =>
          (searchGlobalOrgClimate === "" || (item.question?.toLowerCase() ?? '').includes(searchGlobalOrgClimate)) &&
          (searchGlobalStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGlobalStatus)) &&
          (searchGlobalParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGlobalParticipantLevel)) &&
          (searchGlobalSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGlobalSource)) &&
          (searchGlobalAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGlobalAddedBy)) &&
          (searchGlobalLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGlobalLanguage))
          )
    },
    filteredOrgOrgClimate() {
      if (!this.ORGlibraryData || !this.ORGlibraryData.orgClimate) {
          return [];
        }
        const searchOrgOrgClimate = this.searchOrgOrgClimate ? this.searchOrgOrgClimate.toLowerCase().trim() : '';
        const searchOrgStatus = this.searchOrgOrgClimateStatus ? this.searchOrgOrgClimateStatus.toLowerCase().trim() : '';
        const searchOrgParticipantLevel = this.searchOrgOrgClimateParticipantLevel ? this.searchOrgOrgClimateParticipantLevel.toLowerCase().trim() : '';
        const searchOrgSource = this.searchOrgOrgClimateSource ? this.searchOrgOrgClimateSource.toLowerCase().trim() : '';
        const searchOrgAddedBy = this.searchOrgOrgClimateAddedBy ? this.searchOrgOrgClimateAddedBy.toLowerCase().trim() : '';
        const searchOrgLanguage = this.searchOrgOrgClimateLanguage ? this.searchOrgOrgClimateLanguage.toLowerCase().trim() : '';

        return this.ORGlibraryData.orgClimate.filter(item =>
          (searchOrgOrgClimate === "" || (item.question?.toLowerCase() ?? '').includes(searchOrgOrgClimate)) &&
          (searchOrgStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchOrgStatus)) &&
          (searchOrgParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchOrgParticipantLevel)) &&
          (searchOrgSource === "" || (item.source?.toLowerCase() ?? '').includes(searchOrgSource)) &&
          (searchOrgAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchOrgAddedBy)) &&
          (searchOrgLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchOrgLanguage))
          )
    },
    filteredGospiOrgClimate() {
    if (!this.GOSPIlibraryData || !this.GOSPIlibraryData.orgClimate) {
        return [];
      }
      const searchGospiOrgClimate = this.searchGospiOrgClimate ? this.searchGospiOrgClimate.toLowerCase().trim() : '';
      const searchGospiStatus = this.searchGospiOrgClimateStatus ? this.searchGospiOrgClimateStatus.toLowerCase().trim() : '';
      const searchGospiParticipantLevel = this.searchGospiOrgClimateParticipantLevel ? this.searchGospiOrgClimateParticipantLevel.toLowerCase().trim() : '';
      const searchGospiSource = this.searchGospiOrgClimateSource ? this.searchGospiOrgClimateSource.toLowerCase().trim() : '';
      const searchGospiAddedBy = this.searchGospiOrgClimateAddedBy ? this.searchGospiOrgClimateAddedBy.toLowerCase().trim() : '';
      const searchGospiLanguage = this.searchGospiOrgClimateLanguage ? this.searchGospiOrgClimateLanguage.toLowerCase().trim() : '';

      return this.GOSPIlibraryData.orgClimate.filter(item =>
        (searchGospiOrgClimate === "" || (item.question?.toLowerCase() ?? '').includes(searchGospiOrgClimate)) &&
        (searchGospiStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGospiStatus)) &&
        (searchGospiParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGospiParticipantLevel)) &&
        (searchGospiSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGospiSource)) &&
        (searchGospiAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGospiAddedBy)) &&
        (searchGospiLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGospiLanguage))
        )
    },
  //NetPromoterScore
    filteredGlobalNetPromoterScore() {
    if (!this.GLOBALlibraryData || !this.GLOBALlibraryData.netpromoterScore) {
      return [];
    }
      const searchGlobalNetPromoterScore = this.searchGlobalNetPromoterScore ? this.searchGlobalNetPromoterScore.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreDescription = this.searchGlobalNetPromoterScoreDescription ? this.searchGlobalNetPromoterScoreDescription.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreQuestion = this.searchGlobalNetPromoterScoreQuestion ? this.searchGlobalNetPromoterScoreQuestion.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreLeft = this.searchGlobalNetPromoterScoreLeft ? this.searchGlobalNetPromoterScoreLeft.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreRight = this.searchGlobalNetPromoterScoreRight ? this.searchGlobalNetPromoterScoreRight.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreStatus = this.searchGlobalNetPromoterScoreStatus ? this.searchGlobalNetPromoterScoreStatus.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreParticipantLevel = this.searchGlobalNetPromoterScoreParticipantLevel ? this.searchGlobalNetPromoterScoreParticipantLevel.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreSource = this.searchGlobalNetPromoterScoreSource ? this.searchGlobalNetPromoterScoreSource.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreAddedBy = this.searchGlobalNetPromoterScoreAddedBy ? this.searchGlobalNetPromoterScoreAddedBy.toLowerCase().trim() : '';
      const searchGlobalNetPromoterScoreLanguage = this.searchGlobalNetPromoterScoreLanguage ? this.searchGlobalNetPromoterScoreLanguage.toLowerCase().trim() : '';

      return this.GLOBALlibraryData.netpromoterScore.filter(item =>
        (searchGlobalNetPromoterScore === "" || (item.nps_name?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScore)) &&
        (searchGlobalNetPromoterScoreDescription === "" || (item.nps_description?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreDescription)) &&
        (searchGlobalNetPromoterScoreQuestion === "" || (item.nps_question?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreQuestion)) &&
        (searchGlobalNetPromoterScoreLeft === "" || (item.nps_left?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreLeft)) &&
        (searchGlobalNetPromoterScoreRight === "" || (item.nps_right?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreRight)) &&
        (searchGlobalNetPromoterScoreStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreStatus)) &&
        (searchGlobalNetPromoterScoreParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreParticipantLevel)) &&
        (searchGlobalNetPromoterScoreSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreSource)) &&
        (searchGlobalNetPromoterScoreAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreAddedBy)) &&
        (searchGlobalNetPromoterScoreLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGlobalNetPromoterScoreLanguage))
      );
    },
    filteredOrgNetPromoterScore() {
    if (!this.ORGlibraryData || !this.ORGlibraryData.netpromoterScore) {
      return [];
    }
      const searchOrgNetPromoterScore = this.searchOrgNetPromoterScore ? this.searchOrgNetPromoterScore.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreDescription = this.searchOrgNetPromoterScoreDescription ? this.searchOrgNetPromoterScoreDescription.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreQuestion = this.searchOrgNetPromoterScoreQuestion ? this.searchOrgNetPromoterScoreQuestion.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreLeft = this.searchOrgNetPromoterScoreLeft ? this.searchOrgNetPromoterScoreLeft.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreRight = this.searchOrgNetPromoterScoreRight ? this.searchOrgNetPromoterScoreRight.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreStatus = this.searchOrgNetPromoterScoreStatus ? this.searchOrgNetPromoterScoreStatus.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreParticipantLevel = this.searchOrgNetPromoterScoreParticipantLevel ? this.searchOrgNetPromoterScoreParticipantLevel.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreSource = this.searchOrgNetPromoterScoreSource ? this.searchOrgNetPromoterScoreSource.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreAddedBy = this.searchOrgNetPromoterScoreAddedBy ? this.searchOrgNetPromoterScoreAddedBy.toLowerCase().trim() : '';
      const searchOrgNetPromoterScoreLanguage = this.searchOrgNetPromoterScoreLanguage ? this.searchOrgNetPromoterScoreLanguage.toLowerCase().trim() : '';

      return this.ORGlibraryData.netpromoterScore.filter(item =>
        (searchOrgNetPromoterScore === "" || (item.nps_name?.toLowerCase() ?? '').includes(searchOrgNetPromoterScore)) &&
        (searchOrgNetPromoterScoreDescription === "" || (item.nps_description?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreDescription)) &&
        (searchOrgNetPromoterScoreQuestion === "" || (item.nps_question?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreQuestion)) &&
        (searchOrgNetPromoterScoreLeft === "" || (item.nps_left?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreLeft)) &&
        (searchOrgNetPromoterScoreRight === "" || (item.nps_right?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreRight)) &&
        (searchOrgNetPromoterScoreStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreStatus)) &&
        (searchOrgNetPromoterScoreParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreParticipantLevel)) &&
        (searchOrgNetPromoterScoreSource === "" || (item.source?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreSource)) &&
        (searchOrgNetPromoterScoreAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreAddedBy)) &&
        (searchOrgNetPromoterScoreLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchOrgNetPromoterScoreLanguage))
      );
    },
    filteredGospiNetPromoterScore() {
    if (!this.GOSPIlibraryData || !this.GOSPIlibraryData.netpromoterScore) {
      return [];
    }
      const searchGospiNetPromoterScore = this.searchGospiNetPromoterScore ? this.searchGospiNetPromoterScore.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreDescription = this.searchGospiNetPromoterScoreDescription ? this.searchGospiNetPromoterScoreDescription.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreQuestion = this.searchGospiNetPromoterScoreQuestion ? this.searchGospiNetPromoterScoreQuestion.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreLeft = this.searchGospiNetPromoterScoreLeft ? this.searchGospiNetPromoterScoreLeft.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreRight = this.searchGospiNetPromoterScoreRight ? this.searchGospiNetPromoterScoreRight.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreStatus = this.searchGospiNetPromoterScoreStatus ? this.searchGospiNetPromoterScoreStatus.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreParticipantLevel = this.searchGospiNetPromoterScoreParticipantLevel ? this.searchGospiNetPromoterScoreParticipantLevel.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreSource = this.searchGospiNetPromoterScoreSource ? this.searchGospiNetPromoterScoreSource.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreAddedBy = this.searchGospiNetPromoterScoreAddedBy ? this.searchGospiNetPromoterScoreAddedBy.toLowerCase().trim() : '';
      const searchGospiNetPromoterScoreLanguage = this.searchGospiNetPromoterScoreLanguage ? this.searchGospiNetPromoterScoreLanguage.toLowerCase().trim() : '';

      return this.GOSPIlibraryData.netpromoterScore.filter(item =>
        (searchGospiNetPromoterScore === "" || (item.nps_name?.toLowerCase() ?? '').includes(searchGospiNetPromoterScore)) &&
        (searchGospiNetPromoterScoreDescription === "" || (item.nps_description?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreDescription)) &&
        (searchGospiNetPromoterScoreQuestion === "" || (item.nps_question?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreQuestion)) &&
        (searchGospiNetPromoterScoreLeft === "" || (item.nps_left?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreLeft)) &&
        (searchGospiNetPromoterScoreRight === "" || (item.nps_right?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreRight)) &&
        (searchGospiNetPromoterScoreStatus === "" || (item.status?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreStatus)) &&
        (searchGospiNetPromoterScoreParticipantLevel === "" || (item.participant_level?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreParticipantLevel)) &&
        (searchGospiNetPromoterScoreSource === "" || (item.source?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreSource)) &&
        (searchGospiNetPromoterScoreAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreAddedBy)) &&
        (searchGospiNetPromoterScoreLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchGospiNetPromoterScoreLanguage))
      );
    },
  //SharingOptions
    filteredGlobalSharingOptions() {
      if (!this.GLOBALlibraryData || !this.GLOBALlibraryData.sharingOptions) {
        return [];
      }
      const searchGlobalSharingOptions = this.searchGlobalSharingOptions ? this.searchGlobalSharingOptions.toLowerCase().trim() : '';
      const searchGlobalSharingOptionsSource = this.searchGlobalSharingOptionsSource ? this.searchGlobalSharingOptionsSource.toLowerCase().trim() : '';
      const searchGlobalSharingOptionsAddedBy = this.searchGlobalSharingOptionsAddedBy ? this.searchGlobalSharingOptionsAddedBy.toLowerCase().trim() : '';
      const searchGlobalSharingOptionsLanguage = this.searchGlobalSharingOptionsLanguage ? this.searchGlobalSharingOptionsLanguage.toLowerCase().trim() : '';

      return this.GLOBALlibraryData.sharingOptions.filter(item =>
        (searchGlobalSharingOptions === "" || item.question?.toLowerCase().includes(searchGlobalSharingOptions)) &&
        (searchGlobalSharingOptionsSource === "" || item.source?.toLowerCase().includes(searchGlobalSharingOptionsSource)) &&
        (searchGlobalSharingOptionsAddedBy === "" || item.added_by?.toLowerCase().includes(searchGlobalSharingOptionsAddedBy)) &&
        (searchGlobalSharingOptionsLanguage === "" || item.language?.toLowerCase().includes(searchGlobalSharingOptionsLanguage))
      );
    },
    filteredOrgSharingOptions() {
      if (!this.ORGlibraryData || !this.ORGlibraryData.sharingOptions) {
        return [];
      }

      const searchOrgSharingOptions = this.searchOrgSharingOptions ? this.searchOrgSharingOptions.toLowerCase().trim() : '';
      const searchOrgSharingOptionsSource = this.searchOrgSharingOptionsSource ? this.searchOrgSharingOptionsSource.toLowerCase().trim() : '';
      const searchOrgSharingOptionsAddedBy = this.searchOrgSharingOptionsAddedBy ? this.searchOrgSharingOptionsAddedBy.toLowerCase().trim() : '';
      const searchOrgSharingOptionsLanguage = this.searchOrgSharingOptionsLanguage ? this.searchOrgSharingOptionsLanguage.toLowerCase().trim() : '';

      return this.ORGlibraryData.sharingOptions.filter(item =>
        (searchOrgSharingOptions === "" || (item.question?.toLowerCase() ?? '').includes(searchOrgSharingOptions)) &&
        (searchOrgSharingOptionsSource === "" || (item.source?.toLowerCase() ?? '').includes(searchOrgSharingOptionsSource)) &&
        (searchOrgSharingOptionsAddedBy === "" || (item.added_by?.toLowerCase() ?? '').includes(searchOrgSharingOptionsAddedBy)) &&
        (searchOrgSharingOptionsLanguage === "" || (item.language?.toLowerCase() ?? '').includes(searchOrgSharingOptionsLanguage))
      );
    },
    filteredGospiSharingOptions() {
      if (!this.GOSPIlibraryData || !this.GOSPIlibraryData.sharingOptions) {
        return [];
      }
      const searchGospiSharingOptions = this.searchGospiSharingOptions ? this.searchGospiSharingOptions.toLowerCase().trim() : '';
      const searchGospiSharingOptionsSource = this.searchGospiSharingOptionsSource ? this.searchGospiSharingOptionsSource.toLowerCase().trim() : '';
      const searchGospiSharingOptionsAddedBy = this.searchGospiSharingOptionsAddedBy ? this.searchGospiSharingOptionsAddedBy.toLowerCase().trim() : '';
      const searchGospiSharingOptionsLanguage = this.searchGospiSharingOptionsLanguage ? this.searchGospiSharingOptionsLanguage.toLowerCase().trim() : '';

      return this.GOSPIlibraryData.sharingOptions.filter(item =>
        (searchGospiSharingOptions === "" || item.question?.toLowerCase().includes(searchGospiSharingOptions)) &&
        (searchGospiSharingOptionsSource === "" || item.source?.toLowerCase().includes(searchGospiSharingOptionsSource)) &&
        (searchGospiSharingOptionsAddedBy === "" || item.added_by?.toLowerCase().includes(searchGospiSharingOptionsAddedBy)) &&
        (searchGospiSharingOptionsLanguage === "" || item.language?.toLowerCase().includes(searchGospiSharingOptionsLanguage))
      );
    },
    sortedProperties() {
      let sortedData = [...this.testData]

      if (this.sortBy) {
        sortedData.sort((a, b) => {
          let aValue = a[this.sortBy]
          let bValue = b[this.sortBy]

          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase()
          }
          if (typeof bValue === 'string') {
            bValue = bValue.toLowerCase()
          }

          if (aValue > bValue) {
            return this.sortDirection
          } else if (aValue < bValue) {
            return -this.sortDirection
          } else {
            return 0
          }
        })
      }

      return sortedData
    },
    role: function () {
      for (var key in this.userData) {
        if (key == 'roles') {
          return this.userData[key]
        }
      }
      return ''
    },
  },
}
</script>

<style scoped>
* {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
  /* box-shadow: 2px 4px 5px 0px rgba(0,0,0,0.45); */
}
.body-form-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  position: relative;
}
.input-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.input-container input {
  flex: 1;
  margin: 0;
}
.button-container {
  display: flex;
  flex-direction: row;
}
@media only screen and (min-width: 280px) and (max-width: 900px) {
  .body-form-container {
    font-size: 2.5vw;
    background: white;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
  }
  #table {
    font-size: 2vw;
    border-collapse: collapse;
    word-break: break-word;
  }
  #table {
    font-size: 1.5vw;
  }
}
.table-container-global {
  border: 1px solid #f47820;
  box-shadow: 0px 2px 10px -4px #000000;
  border-top: 5px solid #f47820;
}
.table-container-org {
  border: 1px solid #0e5071;
  box-shadow: 0px 2px 10px -4px #000000;
  border-top: 5px solid #0e5071;
}
.table-container-gospi {
  border: 1px solid #b2c225;
  box-shadow: 0px 2px 10px -4px #000000;
  border-top: 5px solid #b2c225;
}
.accordion {
  background-color: #f7f7f7;
  border: 1px solid grey;
  border-radius: 5px;
  margin-bottom: 20px;
}
.accordion-header {
  /* background-color: #0e5071; */
  color: black;
  font-size: 1.2rem;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.accordion-body {
  padding: 10px;
  background-color: white;
}

/* .search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.search-bar input[type='text'] {
  padding: 10px;
  border: 0.2px solid grey;
  border-radius: 5px 0 0 5px;
  width: 200px;
  font-size: 16px;
  margin-right: 10px;
}
.search-bar select {
  padding: 10px;
  border: 0.2px solid grey;
  border-radius: 0;
  background-color: white;
  font-size: 16px;
  margin-right: 10px;
} */
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
.gospi-select-container {
  display: flex;
  flex-direction: row;
  padding-left: 10px;
  padding-bottom: 10px;
  background-color: rgb(223, 232, 240);
  border: 1px solid grey;
  margin-bottom: 20px;
}

.gospi-select-container div {
  margin-right: 20px;
}
.select-library-container {
  padding-left: 10px;
  padding-bottom: 10px;
  background-color: rgb(223, 232, 240);
  border: 1px solid grey;
}
.control-container {
  margin: 20px;
  padding: 20px;
  background-color: rgb(238, 243, 247);
  box-shadow: 0px 2px 10px -4px #000000;
}
.tables-container {
  margin: 20px;
  padding: 20px;
}
.select-library {
  font-size: 16px;
  min-width: 300px;
}
/* Toggle container styling */
.toggle-wrapper {
  display: flex;
  flex-direction: row;
  align-items: left;
  margin-bottom: 10px;
}

.toggle-label {
  margin-bottom: 5px;
  font-size: 16px;
}

.toggle-global {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 34px;
}
.toggle-org {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 34px;
}

.toggle-global input[type='checkbox'] {
  display: none;
}
.toggle-org input[type='checkbox'] {
  display: none;
}

.toggle-switch {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 34px;
  border-radius: 17px;
  background-color: #ccc;
  transition: background-color 0.3s;
}

.toggle-switch::after {
  content: '';
  display: block;
  position: absolute;
  top: 2px;
  left: 2px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.toggle-global input[type='checkbox']:checked + .toggle-switch {
  background-color: #f47820;
}

.toggle-org input[type='checkbox']:checked + .toggle-switch {
  background-color: #0e5071;
}

.toggle-global input[type='checkbox']:checked + .toggle-switch::after {
  transform: translateX(26px);
}
.toggle-org input[type='checkbox']:checked + .toggle-switch::after {
  transform: translateX(26px);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

#modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent background */
  z-index: 999; /* make sure the modal is on top of other elements */
  display: none;
}

.modal-content {
  overflow-y: scroll;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  max-width: 1400px;
  text-align: center;
  max-height: 80%;
}
.modal-close {
  position: absolute;
  right: 0;
  margin-right: 10px;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%),
    0 1px 5px 0 rgb(0 0 0 / 12%);
  border: none;
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: rgb(237, 125, 61);
  color: white;
}
.modal-close:hover {
  background-color: rgb(255, 197, 91);
  transition: all 0.2s ease-in-out;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.form-container h2 {
  text-align: center;
}

.form-container form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-container label {
  font-weight: bold;
  font-size: 17px;
  margin-right: 10px;
  text-align: left;
  width: 100%;
  margin-bottom: 5px;
}

.modal-details-container input,
.modal-details-container select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  font-size: 14px;
}

.form-container textarea {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
  resize: vertical; /* Allow vertical resizing */
  font-size: 14px;
}

.textarea-container {
  display: flex;
  align-items: center;
}
.textarea-container textarea {
  flex: 1;
}
.textarea-container .remove-btn {
  margin-left: 10px;
  background-color: rgb(240, 89, 89);
  color: white;
  border: 1px solid grey;
  padding: 8px;
  font-size: 12px;
  border-radius: 5px;
}

.textarea-container .remove-btn:active {
  background-color: red;
}
.textarea-container .remove-btn:hover {
  background-color: rgb(240, 67, 67);
}

.sort-icon {
  margin-left: 10px;
}
.container {
  display: flex;
}

.column {
  flex: 1;
  padding: 0 10px;
}
.modal-details-container  {
  border: 1px solid grey;
  padding: 20px;
  margin-bottom:30px;
}
.section-description{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 1rem 0;
}
.section-description label{
  font-weight: bold;
  font-size: 16px;
}
.section-description input[type="text"]{
  outline: none;
  width: 50%;
  padding: .3rem;
  border: none;
  border-bottom: 1px solid gray;
  transition: .5s all;
}
.section-description input[type="text"]:focus{
  border-bottom: 2px solid #6d969c;
}
input, select, option, textarea {
  border: 1px solid grey;
}
</style>
