import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import skillService from "../services/skillService";
import testService from "../services/testService";
import passageService from "../services/passageService";
import audioService from "../services/audioService";
import topicService from "../services/topicService";
import testPartService from "../services/testPartService";
import questionGroupService from "../services/questionGroupService";
import questionService from "../services/questionService";
import mcqQuestionService from "../services/mcqQuestionService";
import mcqOptionService from "../services/mcqOptionService";
import dropdownQuestionService from "../services/dropdownQuestionService";
import dropdownOptionService from "../services/dropdownOptionService";
import matchingQuestionService from "../services/matchingQuestionService";
import matchingAnswerService from "../services/matchingAnswerService";
import fillQuestionService from "../services/fillQuestionService";
import fillAnswerService from "../services/fillAnswerService";
import tfngQuestionService from "../services/tfngQuestionService";
import tfngAnswerService from "../services/tfngAnswerService";
import userService from "../services/userService";

export interface CacheState {
  skills: any[];
  tests: any[];
  passages: any[];
  audios: any[];
  topics: any[];
  testParts: any[];
  questionGroups: any[];
  questions: any[];
  mcqQuestions: any[];
  mcqOptions: any[];
  dropdownQuestions: any[];
  dropdownOptions: any[];
  matchingQuestions: any[];
  matchingAnswers: any[];
  fillQuestions: any[];
  fillAnswers: any[];
  tfngQuestions: any[];
  tfngAnswers: any[];
  users: any[];
  loaded: boolean;
  loading: boolean;
}

const initialState: CacheState = {
  skills: [],
  tests: [],
  passages: [],
  audios: [],
  topics: [],
  testParts: [],
  questionGroups: [],
  questions: [],
  mcqQuestions: [],
  mcqOptions: [],
  dropdownQuestions: [],
  dropdownOptions: [],
  matchingQuestions: [],
  matchingAnswers: [],
  fillQuestions: [],
  fillAnswers: [],
  tfngQuestions: [],
  tfngAnswers: [],
  users: [],
  loaded: false,
  loading: false,
};

export const prefetchAll = createAsyncThunk("cache/prefetchAll", async () => {
  const results = await Promise.allSettled([
    skillService.list(),
    testService.list(),
    passageService.list(),
    audioService.list(),
    topicService.list(),
    testPartService.list({ per_page: 500 }),
    questionGroupService.list({ per_page: 500 }),
    questionService.list({ per_page: 500 }),
    mcqQuestionService.list(),
    mcqOptionService.list(),
    dropdownQuestionService.list(),
    dropdownOptionService.list(),
    matchingQuestionService.list(),
    matchingAnswerService.list(),
    fillQuestionService.list(),
    fillAnswerService.list(),
    tfngQuestionService.list(),
    tfngAnswerService.list(),
    userService.list(),
  ]);

  const extract = (result: PromiseSettledResult<any>) =>
    result.status === "fulfilled" ? result.value?.data?.data || result.value?.data || [] : [];

  return {
    skills: extract(results[0]),
    tests: extract(results[1]),
    passages: extract(results[2]),
    audios: extract(results[3]),
    topics: extract(results[4]),
    testParts: extract(results[5]),
    questionGroups: extract(results[6]),
    questions: extract(results[7]),
    mcqQuestions: extract(results[8]),
    mcqOptions: extract(results[9]),
    dropdownQuestions: extract(results[10]),
    dropdownOptions: extract(results[11]),
    matchingQuestions: extract(results[12]),
    matchingAnswers: extract(results[13]),
    fillQuestions: extract(results[14]),
    fillAnswers: extract(results[15]),
    tfngQuestions: extract(results[16]),
    tfngAnswers: extract(results[17]),
    users: extract(results[18]),
  };
});

const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    invalidateCache(state) {
      state.loaded = false;
    },
    upsertSkill(state, action: PayloadAction<any>) {
      const idx = state.skills.findIndex((x) => x.id === action.payload.id || x.skill_id === action.payload.skill_id);
      if (idx >= 0) state.skills[idx] = action.payload;
      else state.skills.push(action.payload);
    },
    removeSkill(state, action: PayloadAction<any>) {
      state.skills = state.skills.filter((x) => x.id !== action.payload && x.skill_id !== action.payload);
    },
    upsertTest(state, action: PayloadAction<any>) {
      const idx = state.tests.findIndex((x) => x.test_id === action.payload.test_id);
      if (idx >= 0) state.tests[idx] = action.payload;
      else state.tests.push(action.payload);
    },
    removeTest(state, action: PayloadAction<any>) {
      state.tests = state.tests.filter((x) => x.test_id !== action.payload);
    },
    upsertPassage(state, action: PayloadAction<any>) {
      const idx = state.passages.findIndex((x) => x.passage_id === action.payload.passage_id);
      if (idx >= 0) state.passages[idx] = action.payload;
      else state.passages.push(action.payload);
    },
    removePassage(state, action: PayloadAction<any>) {
      state.passages = state.passages.filter((x) => x.passage_id !== action.payload);
    },
    upsertAudio(state, action: PayloadAction<any>) {
      const idx = state.audios.findIndex((x) => x.audio_id === action.payload.audio_id);
      if (idx >= 0) state.audios[idx] = action.payload;
      else state.audios.push(action.payload);
    },
    removeAudio(state, action: PayloadAction<any>) {
      state.audios = state.audios.filter((x) => x.audio_id !== action.payload);
    },
    upsertTopic(state, action: PayloadAction<any>) {
      const idx = state.topics.findIndex((x) => x.topic_id === action.payload.topic_id);
      if (idx >= 0) state.topics[idx] = action.payload;
      else state.topics.push(action.payload);
    },
    removeTopic(state, action: PayloadAction<any>) {
      state.topics = state.topics.filter((x) => x.topic_id !== action.payload);
    },
    upsertTestPart(state, action: PayloadAction<any>) {
      const idx = state.testParts.findIndex((x) => x.part_id === action.payload.part_id);
      if (idx >= 0) state.testParts[idx] = action.payload;
      else state.testParts.push(action.payload);
    },
    removeTestPart(state, action: PayloadAction<any>) {
      state.testParts = state.testParts.filter((x) => x.part_id !== action.payload);
    },
    upsertQuestionGroup(state, action: PayloadAction<any>) {
      const idx = state.questionGroups.findIndex((x) => x.group_id === action.payload.group_id);
      if (idx >= 0) state.questionGroups[idx] = action.payload;
      else state.questionGroups.push(action.payload);
    },
    removeQuestionGroup(state, action: PayloadAction<any>) {
      state.questionGroups = state.questionGroups.filter((x) => x.group_id !== action.payload);
    },
    upsertQuestion(state, action: PayloadAction<any>) {
      const idx = state.questions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.questions[idx] = action.payload;
      else state.questions.push(action.payload);
    },
    removeQuestion(state, action: PayloadAction<any>) {
      state.questions = state.questions.filter((x) => x.question_id !== action.payload);
    },
    upsertMcqQuestion(state, action: PayloadAction<any>) {
      const idx = state.mcqQuestions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.mcqQuestions[idx] = action.payload;
      else state.mcqQuestions.push(action.payload);
    },
    removeMcqQuestion(state, action: PayloadAction<any>) {
      state.mcqQuestions = state.mcqQuestions.filter((x) => x.question_id !== action.payload);
    },
    upsertMcqOption(state, action: PayloadAction<any>) {
      const idx = state.mcqOptions.findIndex((x) => x.option_id === action.payload.option_id);
      if (idx >= 0) state.mcqOptions[idx] = action.payload;
      else state.mcqOptions.push(action.payload);
    },
    removeMcqOption(state, action: PayloadAction<any>) {
      state.mcqOptions = state.mcqOptions.filter((x) => x.option_id !== action.payload);
    },
    upsertDropdownQuestion(state, action: PayloadAction<any>) {
      const idx = state.dropdownQuestions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.dropdownQuestions[idx] = action.payload;
      else state.dropdownQuestions.push(action.payload);
    },
    removeDropdownQuestion(state, action: PayloadAction<any>) {
      state.dropdownQuestions = state.dropdownQuestions.filter((x) => x.question_id !== action.payload);
    },
    upsertDropdownOption(state, action: PayloadAction<any>) {
      const idx = state.dropdownOptions.findIndex((x) => x.option_id === action.payload.option_id);
      if (idx >= 0) state.dropdownOptions[idx] = action.payload;
      else state.dropdownOptions.push(action.payload);
    },
    removeDropdownOption(state, action: PayloadAction<any>) {
      state.dropdownOptions = state.dropdownOptions.filter((x) => x.option_id !== action.payload);
    },
    upsertMatchingQuestion(state, action: PayloadAction<any>) {
      const idx = state.matchingQuestions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.matchingQuestions[idx] = action.payload;
      else state.matchingQuestions.push(action.payload);
    },
    removeMatchingQuestion(state, action: PayloadAction<any>) {
      state.matchingQuestions = state.matchingQuestions.filter((x) => x.question_id !== action.payload);
    },
    upsertMatchingAnswer(state, action: PayloadAction<any>) {
      const idx = state.matchingAnswers.findIndex((x) => x.answer_id === action.payload.answer_id);
      if (idx >= 0) state.matchingAnswers[idx] = action.payload;
      else state.matchingAnswers.push(action.payload);
    },
    removeMatchingAnswer(state, action: PayloadAction<any>) {
      state.matchingAnswers = state.matchingAnswers.filter((x) => x.answer_id !== action.payload);
    },
    upsertFillQuestion(state, action: PayloadAction<any>) {
      const idx = state.fillQuestions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.fillQuestions[idx] = action.payload;
      else state.fillQuestions.push(action.payload);
    },
    removeFillQuestion(state, action: PayloadAction<any>) {
      state.fillQuestions = state.fillQuestions.filter((x) => x.question_id !== action.payload);
    },
    upsertFillAnswer(state, action: PayloadAction<any>) {
      const idx = state.fillAnswers.findIndex((x) => x.answer_id === action.payload.answer_id);
      if (idx >= 0) state.fillAnswers[idx] = action.payload;
      else state.fillAnswers.push(action.payload);
    },
    removeFillAnswer(state, action: PayloadAction<any>) {
      state.fillAnswers = state.fillAnswers.filter((x) => x.answer_id !== action.payload);
    },
    upsertTfngQuestion(state, action: PayloadAction<any>) {
      const idx = state.tfngQuestions.findIndex((x) => x.question_id === action.payload.question_id);
      if (idx >= 0) state.tfngQuestions[idx] = action.payload;
      else state.tfngQuestions.push(action.payload);
    },
    removeTfngQuestion(state, action: PayloadAction<any>) {
      state.tfngQuestions = state.tfngQuestions.filter((x) => x.question_id !== action.payload);
    },
    upsertTfngAnswer(state, action: PayloadAction<any>) {
      const idx = state.tfngAnswers.findIndex((x) => x.answer_id === action.payload.answer_id);
      if (idx >= 0) state.tfngAnswers[idx] = action.payload;
      else state.tfngAnswers.push(action.payload);
    },
    removeTfngAnswer(state, action: PayloadAction<any>) {
      state.tfngAnswers = state.tfngAnswers.filter((x) => x.answer_id !== action.payload);
    },
    upsertUser(state, action: PayloadAction<any>) {
      const idx = state.users.findIndex((x) => x.user_id === action.payload.user_id);
      if (idx >= 0) state.users[idx] = action.payload;
      else state.users.push(action.payload);
    },
    removeUser(state, action: PayloadAction<any>) {
      state.users = state.users.filter((x) => x.user_id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(prefetchAll.pending, (state) => {
        state.loading = true;
      })
      .addCase(prefetchAll.fulfilled, (state, action) => {
        state.skills = action.payload.skills;
        state.tests = action.payload.tests;
        state.passages = action.payload.passages;
        state.audios = action.payload.audios;
        state.topics = action.payload.topics;
        state.testParts = action.payload.testParts;
        state.questionGroups = action.payload.questionGroups;
        state.questions = action.payload.questions;
        state.mcqQuestions = action.payload.mcqQuestions;
        state.mcqOptions = action.payload.mcqOptions;
        state.dropdownQuestions = action.payload.dropdownQuestions;
        state.dropdownOptions = action.payload.dropdownOptions;
        state.matchingQuestions = action.payload.matchingQuestions;
        state.matchingAnswers = action.payload.matchingAnswers;
        state.fillQuestions = action.payload.fillQuestions;
        state.fillAnswers = action.payload.fillAnswers;
        state.tfngQuestions = action.payload.tfngQuestions;
        state.tfngAnswers = action.payload.tfngAnswers;
        state.users = action.payload.users;
        state.loaded = true;
        state.loading = false;
      })
      .addCase(prefetchAll.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  invalidateCache,
  upsertSkill, removeSkill,
  upsertTest, removeTest,
  upsertPassage, removePassage,
  upsertAudio, removeAudio,
  upsertTopic, removeTopic,
  upsertTestPart, removeTestPart,
  upsertQuestionGroup, removeQuestionGroup,
  upsertQuestion, removeQuestion,
  upsertMcqQuestion, removeMcqQuestion,
  upsertMcqOption, removeMcqOption,
  upsertDropdownQuestion, removeDropdownQuestion,
  upsertDropdownOption, removeDropdownOption,
  upsertMatchingQuestion, removeMatchingQuestion,
  upsertMatchingAnswer, removeMatchingAnswer,
  upsertFillQuestion, removeFillQuestion,
  upsertFillAnswer, removeFillAnswer,
  upsertTfngQuestion, removeTfngQuestion,
  upsertTfngAnswer, removeTfngAnswer,
  upsertUser, removeUser,
} = cacheSlice.actions;

export default cacheSlice.reducer;
