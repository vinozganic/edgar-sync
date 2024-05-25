import type { ColumnType } from "kysely";

export type ArrayType<T> = ArrayTypeImpl<T> extends (infer U)[]
  ? U[]
  : ArrayTypeImpl<T>;

export type ArrayTypeImpl<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S[], I[], U[]>
  : T[];

export type EnumTicketStatus = "closed" | "open" | "reopened";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Numeric = ColumnType<string, number | string, number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AcademicYear {
  date_end: Timestamp | null;
  date_start: Timestamp | null;
  id: Generated<number>;
  title: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AdaptivityModel {
  id: Generated<number>;
  name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AdaptivityModelBehaviour {
  id: Generated<number>;
  id_adaptivity_model: number;
  id_question_difficulty_level: number;
  level_down_incorrect_questions: number;
  level_down_questions_to_track: number;
  level_up_correct_questions: number;
  level_up_questions_to_track: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AnswerRegexTriggerTemplate {
  description: string | null;
  id: Generated<number>;
  is_active: boolean;
  ordinal: number;
  regex: string;
  title: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AppUser {
  alt_id: string | null;
  alt_id2: string | null;
  email: string;
  first_name: string;
  google_translate_key: string | null;
  id: Generated<number>;
  id_role: number;
  last_name: string;
  provider: Generated<string>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
  username: string;
}

export interface AppUserCourse {
  id: Generated<number>;
  id_course: number;
  id_teacher: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AppUserRole {
  id: Generated<number>;
  id_app_user: number | null;
  id_role: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface AuditLoggedActions {
  /**
   * Action type; I = insert, D = delete, U = update, T = truncate
   */
  action: string;
  /**
   * Wall clock time at which audited event's trigger call occurred
   */
  action_tstamp_clk: Timestamp;
  /**
   * Statement start timestamp for tx in which audited event occurred
   */
  action_tstamp_stm: Timestamp;
  /**
   * Transaction start timestamp for tx in which audited event occurred
   */
  action_tstamp_tx: Timestamp;
  /**
   * Application name set when this audit event occurred. Can be changed in-session by client.
   */
  application_name: string | null;
  /**
   * New values of fields changed by UPDATE. Null except for row-level UPDATE events.
   */
  changed_fields: string | null;
  /**
   * IP address of client that issued query. Null for unix domain socket.
   */
  client_addr: string | null;
  /**
   * Remote peer IP port address of client that issued query. Undefined for unix socket.
   */
  client_port: number | null;
  /**
   * Top-level query that caused this auditable event. May be more than one statement.
   */
  client_query: string | null;
  /**
   * Unique identifier for each auditable event
   */
  event_id: Generated<Int8>;
  /**
   * Table OID. Changes with drop/create. Get with 'tablename'::regclass
   */
  relid: number;
  /**
   * Record value. Null for statement-level trigger. For INSERT this is the new tuple. For DELETE and UPDATE it is the old tuple.
   */
  row_data: string | null;
  /**
   * Database schema audited table for this event is in
   */
  schema_name: string;
  /**
   * Login / session user whose statement caused the audited event
   */
  session_user_name: string | null;
  /**
   * 't' if audit event is from an FOR EACH STATEMENT trigger, 'f' for FOR EACH ROW
   */
  statement_only: boolean;
  /**
   * Non-schema-qualified table name of table event occured in
   */
  table_name: string;
  /**
   * Identifier of transaction that made the change. May wrap, but unique paired with action_tstamp_tx.
   */
  transaction_id: Int8 | null;
}

export interface CheckColumnMode {
  id: number;
  mode_desc: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CodeRunner {
  db_schema: string | null;
  host: string;
  id: Generated<number>;
  name: string;
  path: string;
  port: number;
  timeout: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CodeSnippet {
  code: string;
  id: Generated<number>;
  id_code_runner: number;
  id_course: number;
  id_student: number;
  is_public: Generated<boolean>;
  title: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Computer {
  id: Generated<number>;
  ip: string;
  room: string;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  user_created: string;
  user_modified: string | null;
}

export interface ConnectedElementsCorrectnessModel {
  correctness: number[] | null;
  id: Generated<number>;
  model_name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ConnectedElementsQuestion {
  id: Generated<number>;
  id_connected_elements_correctness_model: Generated<number>;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ConnectedElementsQuestionAnswer {
  answer_text_dynamic: string;
  answer_text_static: string | null;
  id: Generated<number>;
  id_question: number;
  ordinal: number;
  penalty_percentage: Generated<Numeric>;
  ts_created: Timestamp;
  ts_modified: string;
  user_created: string;
  user_modified: string;
}

export interface Course {
  course_acronym: string;
  course_desc: string | null;
  course_name: string;
  course_url: string | null;
  data_object: string | null;
  ects_credits: Numeric | null;
  id: Generated<number>;
  id_root_node: number | null;
  is_competitive: Generated<boolean>;
  show_attachments: Generated<boolean>;
  show_codemirror: Generated<boolean>;
  show_event_log: Generated<boolean>;
  show_runtime_constraints: Generated<boolean>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
  uses_mobile_app: Generated<boolean>;
  uses_ticketing: Generated<boolean>;
}

export interface CourseCodeRunner {
  id: Generated<number>;
  id_code_runner: number;
  id_course: number;
  id_programming_language: number;
  id_type: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CourseTag {
  id: Generated<number>;
  id_course: number;
  tag: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CQuestionAnswer {
  c_prefix: string | null;
  c_source: string | null;
  c_suffix: string | null;
  id: Generated<number>;
  id_programming_language: number;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CQuestionTest {
  allow_diff_letter_size: Generated<boolean>;
  allow_diff_order: Generated<boolean>;
  allow_subset: Generated<boolean>;
  c_question_answer_id: number;
  c_test_type_id: number;
  comment: string | null;
  id: Generated<number>;
  is_public: Generated<boolean>;
  percentage: Generated<Numeric>;
  regex_override: string | null;
  trim_whitespace: Generated<boolean>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface CTestType {
  id: number;
  test_type_name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface DataType {
  id: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  type_name: string;
  user_created: string;
  user_modified: string;
}

export interface DendrogramDistanceAlgorithm {
  id: number;
  name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface DiagramQuestionAnswer {
  diagram_answer: string;
  id: Generated<number>;
  id_question: number;
  initial_diagram_answer: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface EmailHandledReminders {
  id: Generated<number>;
  id_test: number;
  reminder_type: string;
  threshold: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface EmailQueue {
  id: Generated<number>;
  mail_bcc: string;
  mail_cc: string;
  mail_from: string;
  mail_subject: string;
  mail_text: string;
  mail_to: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface EmailReminderScheme {
  id: Generated<number>;
  name: string;
  thresholds_not_started: number[] | null;
  thresholds_ongoing: number[] | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Exercise {
  description: string | null;
  id: Generated<number>;
  id_academic_year: number;
  id_adaptivity_model: number;
  id_course: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: boolean;
  title: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ExerciseNode {
  id: Generated<number>;
  id_exercise: number;
  id_node: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ExerciseStudent {
  id: Generated<number>;
  id_exercise: number;
  id_student: number;
  is_finished: Generated<boolean>;
  ts_created: Timestamp;
  ts_finished: Timestamp | null;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ExerciseStudentQuestion {
  answers_permutation: number[] | null;
  id: Generated<number>;
  id_exercise: number;
  id_question: number;
  id_student: number;
  is_correct: boolean | null;
  ordinal: number;
  student_answer_code: string | null;
  student_answers: number[] | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ExerciseStudentQuestionAttempt {
  id: Generated<number>;
  id_exercise: number;
  id_question: number;
  id_student: number;
  is_correct: boolean;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Feedback {
  comment: string | null;
  exercise_question_ordinal: number | null;
  id: Generated<number>;
  id_academic_year: number;
  id_course: number;
  id_exercise: number | null;
  id_question: number | null;
  id_student: number;
  id_tutorial: number | null;
  id_tutorial_step: number | null;
  max_rating: number | null;
  rating: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface FixedTest {
  c_question_test_id: number;
  id: Generated<number>;
  input: string;
  output: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface GeneratorTest {
  arguments: string | null;
  c_question_test_id: number;
  generator_test_file_id: number;
  id: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface GeneratorTestFile {
  description: string | null;
  file: string;
  id: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface GlobalDataObject {
  data_object: Generated<string>;
  id: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface GradingModel {
  correct_score: Numeric;
  id: Generated<number>;
  incorrect_score: Numeric;
  model_name: string;
  threshold: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  unanswered_score: Numeric;
  user_created: string;
  user_modified: string;
}

export interface J0UnitType {
  id: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  type_name: string;
  user_created: string;
  user_modified: string;
}

export interface JsonQuestionAnswer {
  assert_deep: Generated<boolean>;
  assert_strict: Generated<boolean>;
  id: Generated<number>;
  id_code_runner: number;
  id_question: number;
  json_alt_assertion: string | null;
  json_alt_presentation_query: string | null;
  json_answer: string;
  json_test_fixture: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface LocalProvider {
  id: Generated<number>;
  id_student: number;
  password: string | null;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  user_created: string;
  user_modified: string | null;
  username: string | null;
}

export interface Node {
  description: string | null;
  id: Generated<number>;
  id_node_type: number;
  node_name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface NodeHierarchy {
  description: string | null;
  id: Generated<number>;
  name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface NodeParent {
  id: Generated<number>;
  id_child: number;
  id_parent: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface NodeType {
  color: Generated<string>;
  id: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  type_name: string | null;
  user_created: string;
  user_modified: string;
}

export interface OrderedElementCorrectnessModel {
  correctness: number[] | null;
  id: Generated<number>;
  model_name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface OrderedElementQuestion {
  display_option: Generated<string>;
  id: Generated<number>;
  id_ordered_element_correctness_model: Generated<number>;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Pace {
  id: Generated<number>;
  pace_name: string;
  timeouts: number[];
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PeerShuffle {
  id: Generated<number>;
  id_test_instance_question: number;
  id_test_phase_2: number;
  jobs: number[] | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PeerTest {
  assessments_no: number;
  calib_assessments_no: number | null;
  id: Generated<number>;
  id_test_phase_1: number;
  id_test_phase_2: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PeerTestGroup {
  id: Generated<number>;
  id_calib_assessments_node: number | null;
  id_peer_test: number;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PeerTestGroupQuestion {
  id: Generated<number>;
  id_grading_model: number | null;
  id_peer_test_group: number;
  id_question: number;
  ordinal: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PeerTestGroupQuestionCalib {
  id: Generated<number>;
  id_peer_test_group_question: number;
  id_question_calib: number;
  id_scale_item: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PermUserCourse {
  id: Generated<number>;
  id_course: number | null;
  id_user: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PlagDetectionAlgorithm {
  id: number;
  name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PlagDetectionData {
  color_per_question: string | null;
  data_per_question: string | null;
  id: Generated<number>;
  id_plag_detection_algorithm: number;
  id_test: number;
  questions: string | null;
  similarity_per_question: string | null;
  students_per_question: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface PlaygroundCodeRunner {
  id: Generated<number>;
  id_code_runner: number;
  id_course: number;
  ordinal: number;
  student_can_see: Generated<boolean>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ProgrammingLanguage {
  compiler_options: string | null;
  extension: string | null;
  hello_world: string | null;
  id: Generated<number>;
  judge0_id: number | null;
  name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Question {
  grader_object: string | null;
  id: Generated<number>;
  id_prev_question: number | null;
  id_question_type: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: boolean;
  question_comment: string | null;
  question_text: string;
  required_upload_files_no: Generated<number>;
  time_limit: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  upload_files_no: Generated<number>;
  user_created: string;
  user_modified: string;
  version: number;
}

export interface QuestionAnswer {
  answer_text: string;
  id: Generated<number>;
  id_question: number;
  is_correct: boolean;
  ordinal: number;
  penalty_percentage: Generated<Numeric>;
  threshold_weight: Generated<number>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionAssignedDifficulty {
  id: Generated<number>;
  id_adaptivity_model: number;
  id_difficulty_level: number;
  id_question: number;
  id_user_created: number;
  id_user_modified: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionAttachment {
  filename: string;
  id: Generated<number>;
  id_question: number | null;
  is_public: Generated<boolean | null>;
  label: string | null;
  original_name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionComputedDifficulty {
  difficulty: number;
  difficulty_std_err: number | null;
  discriminating_power: number | null;
  discriminating_power_std_err: number | null;
  id: Generated<number>;
  id_question: number;
  id_question_difficulty_computation: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionCourseTag {
  id: Generated<number>;
  id_course_tag: number;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionDataObject {
  data_object: Generated<string>;
  id: Generated<number>;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionDifficultyComputation {
  id: Generated<number>;
  id_exercise: number;
  id_user_created: number | null;
  max_difficulty: number | null;
  max_discriminating_power: number | null;
  mean_difficulty: number | null;
  mean_discriminating_power: number | null;
  min_difficulty: number | null;
  min_discriminating_power: number | null;
  no_model_params: number;
  no_questions: number | null;
  results_json: string | null;
  ts_created: Timestamp;
  ts_finished: Timestamp | null;
  ts_modified: Timestamp;
  ts_started: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionDifficultyLevel {
  id: Generated<number>;
  id_adaptivity_model: number;
  name: string;
  ordinal: number;
  rgb_color: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionEvalScript {
  eval_script: Generated<string>;
  id: Generated<number>;
  id_question: number;
  id_script_programming_language: Generated<number | null>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionNode {
  id: Generated<number>;
  id_node: number;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionProgrammingLanguage {
  id: Generated<number>;
  id_programming_language: number;
  id_question: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionReview {
  id: Generated<number>;
  id_question: number;
  id_user_reviewed: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionScale {
  id: Generated<number>;
  id_question: number;
  id_scale: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface QuestionType {
  has_answers: Generated<boolean>;
  has_permutations: Generated<boolean>;
  id: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  type_name: string | null;
  user_created: string;
  user_modified: string;
}

export interface RandomTest {
  c_question_test_id: number;
  elem_count: number | null;
  id: Generated<number>;
  low_bound: Numeric | null;
  random_test_type_id: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  upper_bound: Numeric | null;
  user_created: string;
  user_modified: string;
}

export interface RandomTestType {
  id: number;
  random_test_type_name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface RealTimePlagDetectionData {
  colors: string | null;
  data: string | null;
  id: Generated<number>;
  id_plag_detection_algorithm: number;
  id_question: number;
  id_test: number;
  similarities: string | null;
  students: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Role {
  id: Generated<number>;
  role_name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface RuntimeConstraint {
  default_value: string;
  id: Generated<number>;
  id_data_type: number;
  id_j0_unit_type: number | null;
  name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface RuntimeConstraintCourse {
  id: Generated<number>;
  id_course: number;
  id_programming_language: number;
  id_runtime_constraint: number;
  override_value: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface RuntimeConstraintQuestion {
  id: Generated<number>;
  id_programming_language: number;
  id_question: number;
  id_runtime_constraint: number;
  override_value: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface RuntimeConstraintTest {
  id: Generated<number>;
  id_c_question_test: number;
  id_programming_language: number;
  id_runtime_constraint: number;
  override_value: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Scale {
  id: Generated<number>;
  name: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface ScaleItem {
  id: Generated<number>;
  id_scale: number;
  label: string;
  ordinal: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
  value: number;
}

export interface Semester {
  id: number;
  title: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface SqlQuestionAnswer {
  check_tuple_order: Generated<boolean>;
  id: Generated<number>;
  id_check_column_mode: Generated<number>;
  id_code_runner: number;
  id_question: number;
  sql_alt_assertion: string | null;
  sql_alt_presentation_query: string | null;
  sql_answer: string;
  sql_test_fixture: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface StashBodovi7za2lv {
  grade_bc7: number | null;
  id_student: number | null;
  rb1: Numeric | null;
  rb2: Numeric | null;
  rb3: Numeric | null;
  rb4: Numeric | null;
  rgradebias: Numeric | null;
}

export interface StashBodovi7zalv2 {
  grade_bc7: number | null;
  id_student: number | null;
  rb1: Numeric | null;
  rb2: Numeric | null;
  rb3: Numeric | null;
  rb4: Numeric | null;
  rgradebias: Numeric | null;
}

export interface StashBodoviza2lv {
  grade_bc: number | null;
  id_student: number | null;
}

export interface StashBodoviza3lvibias {
  bias: Numeric | null;
  id_student: number | null;
  std: number | null;
}

export interface StashPaperUproZirTi {
  comp_username: string | null;
  correct_no: number | null;
  id: number | null;
  id_student: number | null;
  id_test: number | null;
  incorrect_no: number | null;
  interupted: boolean | null;
  ip_address: string | null;
  partial_no: number | null;
  passed: boolean | null;
  prolonged: boolean | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  ts_created: Timestamp | null;
  ts_generated: Timestamp | null;
  ts_modified: Timestamp | null;
  ts_started: Timestamp | null;
  ts_submitted: Timestamp | null;
  unanswered_no: number | null;
  user_created: string | null;
  user_modified: string | null;
}

export interface StashPaperUproZirTiq {
  answers_permutation: number[] | null;
  c_eval_data: string | null;
  correct_answers_permutation: number[] | null;
  hint: string | null;
  id: number | null;
  id_grading_model: number | null;
  id_question: number | null;
  id_test_instance: number | null;
  id_test_part: number | null;
  is_correct: boolean | null;
  is_incorrect: boolean | null;
  is_partial: boolean | null;
  is_unanswered: boolean | null;
  ordinal: number | null;
  penalty_percentage_permutation: ArrayType<Numeric> | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  student_answer_code: string | null;
  student_answer_code_pl: number | null;
  student_answer_text: string | null;
  student_answers: number[] | null;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  ts_started: Timestamp | null;
  uploaded_files: string | null;
  user_created: string | null;
  user_modified: string | null;
  weights_permutation: number[] | null;
}

export interface StashPaperUproZiTi {
  comp_username: string | null;
  correct_no: number | null;
  id: number | null;
  id_student: number | null;
  id_test: number | null;
  incorrect_no: number | null;
  interupted: boolean | null;
  ip_address: string | null;
  partial_no: number | null;
  passed: boolean | null;
  prolonged: boolean | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  ts_created: Timestamp | null;
  ts_generated: Timestamp | null;
  ts_modified: Timestamp | null;
  ts_started: Timestamp | null;
  ts_submitted: Timestamp | null;
  unanswered_no: number | null;
  user_created: string | null;
  user_modified: string | null;
}

export interface StashPaperUproZiTiq {
  answers_permutation: number[] | null;
  c_eval_data: string | null;
  correct_answers_permutation: number[] | null;
  hint: string | null;
  id: number | null;
  id_grading_model: number | null;
  id_question: number | null;
  id_test_instance: number | null;
  id_test_part: number | null;
  is_correct: boolean | null;
  is_incorrect: boolean | null;
  is_partial: boolean | null;
  is_unanswered: boolean | null;
  ordinal: number | null;
  penalty_percentage_permutation: ArrayType<Numeric> | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  student_answer_code: string | null;
  student_answer_code_pl: number | null;
  student_answer_text: string | null;
  student_answers: number[] | null;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  ts_started: Timestamp | null;
  uploaded_files: string | null;
  user_created: string | null;
  user_modified: string | null;
  weights_permutation: number[] | null;
}

export interface Student {
  alt_id: string | null;
  alt_id2: string | null;
  email: string | null;
  first_name: string;
  group_name: string | null;
  id: Generated<number>;
  id_app_user: number | null;
  is_anonymous: Generated<boolean>;
  last_name: string;
  provider: Generated<string | null>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface StudentCourse {
  class_group: string | null;
  id: Generated<number>;
  id_academic_year: number;
  id_course: number;
  id_student: number;
  id_teacher: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface StudentToken {
  id: Generated<number>;
  is_activated: Generated<boolean>;
  pin: string;
  student_id: number;
  token: string;
  ts_created: Timestamp;
  ts_modified: Timestamp | null;
  ts_valid_until: Timestamp;
  user_created: string;
  user_modified: string | null;
}

export interface TeacherLectureQuizInstance {
  allow_anonymous: boolean;
  current_question_ordinal: number;
  id: Generated<number>;
  id_app_user: number;
  id_test: number;
  room_name: string;
  ts_created: Timestamp | null;
  ts_ended: Timestamp | null;
  ts_modified: Timestamp | null;
  ts_started: Timestamp;
  user_created: string;
  user_modified: string | null;
}

export interface TempDontdelete {
  id: number | null;
}

export interface Test {
  allow_anonymous: Generated<boolean>;
  allow_anonymous_stalk: Generated<boolean>;
  async_submit: Generated<boolean>;
  duration_seconds: number;
  eval_comp_score: string | null;
  forward_only: Generated<boolean>;
  hint_result: Generated<boolean>;
  id: Generated<number>;
  id_academic_year: number;
  id_course: number;
  id_email_reminder_scheme: number | null;
  id_parent: number | null;
  id_plag_detection_algorithm: number | null;
  id_semester: number;
  id_test_type: number;
  id_ticket_policy: Generated<number>;
  id_user_created: number;
  is_competition: Generated<boolean | null>;
  is_global: Generated<boolean>;
  is_public: Generated<boolean>;
  max_runs: number;
  max_score: Numeric;
  pass_percentage: Numeric;
  password: string;
  questions_no: number;
  review_period_mins: Generated<number>;
  show_solutions: boolean;
  test_ordinal: number;
  test_score_ignored: Generated<boolean>;
  title: string;
  title_abbrev: string | null;
  trim_clock: Generated<boolean>;
  ts_available_from: Timestamp;
  ts_available_to: Timestamp;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  upload_file_limit: Generated<number>;
  use_in_stats: Generated<boolean>;
  user_created: string;
  user_modified: string;
}

export interface TestCorrection {
  id: Generated<number>;
  id_test_instance_question: number;
  id_user_created: number;
  reason: string;
  score_delta: Numeric | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestInstance {
  comp_username: string | null;
  correct_no: number | null;
  id: Generated<number>;
  id_student: number;
  id_test: number;
  incorrect_no: number | null;
  interupted: boolean | null;
  ip_address: string | null;
  partial_no: number | null;
  passed: boolean | null;
  prolonged: boolean | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  ts_created: Timestamp;
  ts_generated: Timestamp;
  ts_modified: Timestamp;
  ts_started: Timestamp | null;
  ts_submitted: Timestamp | null;
  unanswered_no: number | null;
  user_created: string;
  user_modified: string;
}

export interface TestInstanceGenLock {
  id: Generated<number>;
  id_course: number | null;
  id_student: number | null;
  password: string | null;
  ts_created: Timestamp;
}

export interface TestInstanceQuestion {
  answers_permutation: number[] | null;
  c_eval_data: string | null;
  correct_answers_permutation: number[] | null;
  hint: string | null;
  id: Generated<number>;
  id_grading_model: number;
  id_question: number;
  id_test_instance: number;
  id_test_part: number | null;
  is_correct: boolean | null;
  is_incorrect: boolean | null;
  is_partial: boolean | null;
  is_unanswered: boolean | null;
  ordinal: number;
  penalty_percentage_permutation: ArrayType<Numeric> | null;
  score: Numeric | null;
  score_perc: Numeric | null;
  student_answer_code: string | null;
  student_answer_code_pl: number | null;
  student_answer_text: string | null;
  student_answers: number[] | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  ts_started: Timestamp | null;
  uploaded_files: string | null;
  user_created: string;
  user_modified: string;
  weights_permutation: number[] | null;
}

export interface TestInstanceQuestionCompScore {
  base_score: Numeric | null;
  comp_score: Numeric | null;
  id: Generated<number>;
  id_test_instance_question: number;
  number_of_runs: number | null;
  time_passed: number | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestInstanceQuestionGenerated {
  data_object: string;
  id: Generated<number>;
  id_test_instance_question: number;
  question_abc_answers_html: string[] | null;
  question_text_html: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestInstanceQuestionManualGrade {
  comment: string | null;
  id: Generated<number>;
  id_app_user: number | null;
  id_test_instance_question: number;
  score: Numeric | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestInstanceQuestionRun {
  base_score: Numeric | null;
  id: Generated<number>;
  id_test_instance_question: number;
  is_correct: boolean | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  ts_submitted: Generated<Timestamp>;
  user_created: string;
  user_modified: string;
}

export interface TestInstanceRoom {
  id: Generated<number>;
  id_teacher_instance: number;
  id_test_instance: number;
  room_name: string;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  user_created: string;
  user_modified: string | null;
}

export interface TestMessage {
  id: Generated<number>;
  id_student: number;
  id_test: number;
  message_body: string;
  message_title: string;
  ts_created: Timestamp;
  ts_displayed: Timestamp | null;
  ts_modified: Timestamp;
  ts_sent: Timestamp | null;
  user_created: string;
  user_modified: string;
}

export interface TestPace {
  id: Generated<number>;
  id_pace_question: number | null;
  id_pace_test: number | null;
  id_test: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestPart {
  id: Generated<number>;
  id_grading_model: number | null;
  id_node: number;
  id_question_type: number | null;
  id_test: number;
  max_questions: number;
  min_questions: number;
  ordinal: Generated<number>;
  pass_percentage: Generated<Numeric>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TestQuestion {
  id: Generated<number>;
  id_grading_model: number | null;
  id_question: number;
  id_test: number;
  ordinal: number;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  user_created: string;
  user_modified: string | null;
}

export interface TestType {
  fixed_questions: Generated<boolean>;
  id: Generated<number>;
  skip_permutations: Generated<boolean>;
  standalone: Generated<boolean>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  type_name: string | null;
  user_created: string;
  user_modified: string;
}

export interface TextQuestionAnswer {
  id: Generated<number>;
  id_question: number;
  text_answer: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Ticket {
  comments: Generated<ArrayType<Json>>;
  id: Generated<number>;
  id_assigned_user: number | null;
  id_test_instance_question: number;
  status: Generated<EnumTicketStatus>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TicketMessage {
  id: Generated<number>;
  id_student: number;
  id_test: number;
  ordinal: number;
  ts_created: Timestamp;
  ts_displayed: Timestamp | null;
  ts_modified: Timestamp;
  ts_sent: Timestamp | null;
  user_created: string;
  user_modified: string;
}

export interface TicketPolicy {
  id: number;
  policy_name: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
  uses_tickets_exam: boolean;
  uses_tickets_exercise: Generated<boolean>;
  uses_tickets_review: boolean;
  uses_tickets_tutorial: Generated<boolean>;
}

export interface TicketSubscription {
  id: Generated<number>;
  id_app_user: number | null;
  id_question: number | null;
  id_test: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface Tutorial {
  allow_random_access: Generated<boolean>;
  id: Generated<number>;
  id_node: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: boolean;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  tutorial_desc: string | null;
  tutorial_title: string;
  user_created: string;
  user_modified: string;
}

export interface TutorialCodeQuestionHint {
  answer_regex_trigger: string;
  hint_text: string;
  id: Generated<number>;
  id_question: number;
  id_step: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: boolean;
  ordinal: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialCourse {
  id: Generated<number>;
  id_course: number;
  id_tutorial: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialQuestionHint {
  hint_text: string;
  id: Generated<number>;
  id_question_answer: number;
  id_step: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: boolean;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialStep {
  id: Generated<number>;
  id_code_runner: number | null;
  id_question: number | null;
  id_tutorial: number;
  id_user_created: number;
  id_user_modified: number;
  ordinal: number;
  text: string | null;
  title: string | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialStepHint {
  hint_text: string | null;
  id: Generated<number>;
  id_step: number;
  id_user_created: number;
  id_user_modified: number;
  is_active: Generated<boolean>;
  ordinal: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialStudent {
  id: Generated<number>;
  id_course: number;
  id_student: number;
  id_tutorial: number;
  is_finished: Generated<boolean>;
  ts_created: Timestamp;
  ts_finished: Timestamp | null;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialStudentQuestion {
  answers_permutation: number[] | null;
  id: Generated<number>;
  id_course: number;
  id_question: number;
  id_student: number;
  id_tutorial: number;
  is_correct: boolean | null;
  student_answer_code: string | null;
  student_answers: number[] | null;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialStudentQuestionAttempt {
  id: Generated<number>;
  id_course: number;
  id_question: number;
  id_student: number;
  id_tutorial: number;
  is_correct: boolean;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialTicket {
  comments: Generated<ArrayType<Json>>;
  id: Generated<number>;
  id_assigned_user: number | null;
  id_student: number;
  id_tutorial_step: number;
  status: Generated<EnumTicketStatus>;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface TutorialTicketMessage {
  id: Generated<number>;
  id_tutorial_ticket: number;
  ts_created: Timestamp;
  ts_displayed: Timestamp | null;
  ts_modified: Timestamp;
  ts_sent: Timestamp | null;
  user_created: string;
  user_modified: string;
}

export interface TutorialTicketSubscription {
  id: Generated<number>;
  id_app_user: number | null;
  id_tutorial: number;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface UproScheduleSetTestParams {
  group_no: number;
  id: Generated<number>;
  id_test: number;
  test_password: string;
  ts_created: Timestamp;
  ts_end: Timestamp;
  ts_modified: Timestamp;
  ts_start: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface VCalibQuestionAnswer {
  id_question_calib: number | null;
  ordinal: number | null;
  value: number | null;
}

export interface VD3tree {
  depth: number | null;
  id: number | null;
  id_course: number | null;
  id_ext: string | null;
  id_parent: number | null;
  id_parent_ext: string | null;
  node_name: string | null;
}

export interface Versions {
  id: number;
  tag: string;
  ts_created: Timestamp;
  ts_modified: Timestamp;
  user_created: string;
  user_modified: string;
}

export interface VExerciseQuestion {
  id_exercise: number | null;
  id_question: number | null;
}

export interface VNodePath {
  depth: number | null;
  id: number | null;
  path: string | null;
  rpath: string | null;
}

export interface VNodeTree {
  color: string | null;
  depth: number | null;
  description: string | null;
  id: number | null;
  id_course: number | null;
  id_ext: string | null;
  id_node_type: number | null;
  id_parent: number | null;
  id_parent_ext: string | null;
  node_name: string | null;
  type_name: string | null;
}

export interface VPeerShuffle {
  first_name1: string | null;
  first_name2: string | null;
  id_pa_test: number | null;
  id_peer_shuffle: number | null;
  id_question_pa1: number | null;
  id_student1: number | null;
  id_student2: number | null;
  id_test_instance_question1: number | null;
  id_test_instance_question2: number | null;
  id_test_instance2: number | null;
  id_test_phase_1: number | null;
  id_test_phase_2: number | null;
  last_name1: string | null;
  last_name2: string | null;
  ordinal2: Int8 | null;
}

export interface VRootsChildren {
  depth: number | null;
  id_child: number | null;
  id_parent: number | null;
  id_root: number | null;
}

export interface VStudentQuestionInstanceAnswer {
  id_question: number | null;
  id_student: number | null;
  is_correct: number | null;
}

export interface VStudentQuestionInstanceCorrect {
  id_question: number | null;
  id_student: number | null;
  is_correct: number | null;
}

export interface VStudentTotalScore {
  id_course: number | null;
  id_student: number | null;
  score: Numeric | null;
}

export interface VTestStats {
  allow_anonymous: boolean | null;
  allow_anonymous_stalk: boolean | null;
  async_submit: boolean | null;
  duration_seconds: number | null;
  eval_comp_score: string | null;
  forward_only: boolean | null;
  hint_result: boolean | null;
  id: number | null;
  id_academic_year: number | null;
  id_course: number | null;
  id_email_reminder_scheme: number | null;
  id_parent: number | null;
  id_semester: number | null;
  id_test_type: number | null;
  id_user_created: number | null;
  is_competition: boolean | null;
  is_global: boolean | null;
  is_public: boolean | null;
  max_runs: number | null;
  max_score: Numeric | null;
  pass_percentage: Numeric | null;
  password: string | null;
  questions_no: number | null;
  review_period_mins: number | null;
  show_solutions: boolean | null;
  test_ordinal: number | null;
  test_score_ignored: boolean | null;
  title: string | null;
  title_abbrev: string | null;
  trim_clock: boolean | null;
  ts_available_from: Timestamp | null;
  ts_available_to: Timestamp | null;
  ts_created: Timestamp | null;
  ts_modified: Timestamp | null;
  upload_file_limit: number | null;
  use_in_stats: boolean | null;
  user_modified: string | null;
}

export interface VTmp {
  cnt_active: Int8 | null;
  cnt_inactive: Int8 | null;
  depth: number | null;
  id_child: number | null;
  id_parent: number | null;
  id_root: number | null;
  node_name: string | null;
}

export interface EdgarDB {
  academic_year: AcademicYear;
  adaptivity_model: AdaptivityModel;
  adaptivity_model_behaviour: AdaptivityModelBehaviour;
  answer_regex_trigger_template: AnswerRegexTriggerTemplate;
  app_user: AppUser;
  app_user_course: AppUserCourse;
  app_user_role: AppUserRole;
  "audit.logged_actions": AuditLoggedActions;
  c_question_answer: CQuestionAnswer;
  c_question_test: CQuestionTest;
  c_test_type: CTestType;
  check_column_mode: CheckColumnMode;
  code_runner: CodeRunner;
  code_snippet: CodeSnippet;
  computer: Computer;
  connected_elements_correctness_model: ConnectedElementsCorrectnessModel;
  connected_elements_question: ConnectedElementsQuestion;
  connected_elements_question_answer: ConnectedElementsQuestionAnswer;
  course: Course;
  course_code_runner: CourseCodeRunner;
  course_tag: CourseTag;
  data_type: DataType;
  dendrogram_distance_algorithm: DendrogramDistanceAlgorithm;
  diagram_question_answer: DiagramQuestionAnswer;
  email_handled_reminders: EmailHandledReminders;
  email_queue: EmailQueue;
  email_reminder_scheme: EmailReminderScheme;
  exercise: Exercise;
  exercise_node: ExerciseNode;
  exercise_student: ExerciseStudent;
  exercise_student_question: ExerciseStudentQuestion;
  exercise_student_question_attempt: ExerciseStudentQuestionAttempt;
  feedback: Feedback;
  fixed_test: FixedTest;
  generator_test: GeneratorTest;
  generator_test_file: GeneratorTestFile;
  global_data_object: GlobalDataObject;
  grading_model: GradingModel;
  j0_unit_type: J0UnitType;
  json_question_answer: JsonQuestionAnswer;
  local_provider: LocalProvider;
  node: Node;
  node_hierarchy: NodeHierarchy;
  node_parent: NodeParent;
  node_type: NodeType;
  ordered_element_correctness_model: OrderedElementCorrectnessModel;
  ordered_element_question: OrderedElementQuestion;
  pace: Pace;
  peer_shuffle: PeerShuffle;
  peer_test: PeerTest;
  peer_test_group: PeerTestGroup;
  peer_test_group_question: PeerTestGroupQuestion;
  peer_test_group_question_calib: PeerTestGroupQuestionCalib;
  perm_user_course: PermUserCourse;
  plag_detection_algorithm: PlagDetectionAlgorithm;
  plag_detection_data: PlagDetectionData;
  playground_code_runner: PlaygroundCodeRunner;
  programming_language: ProgrammingLanguage;
  question: Question;
  question_answer: QuestionAnswer;
  question_assigned_difficulty: QuestionAssignedDifficulty;
  question_attachment: QuestionAttachment;
  question_computed_difficulty: QuestionComputedDifficulty;
  question_course_tag: QuestionCourseTag;
  question_data_object: QuestionDataObject;
  question_difficulty_computation: QuestionDifficultyComputation;
  question_difficulty_level: QuestionDifficultyLevel;
  question_eval_script: QuestionEvalScript;
  question_node: QuestionNode;
  question_programming_language: QuestionProgrammingLanguage;
  question_review: QuestionReview;
  question_scale: QuestionScale;
  question_type: QuestionType;
  random_test: RandomTest;
  random_test_type: RandomTestType;
  real_time_plag_detection_data: RealTimePlagDetectionData;
  role: Role;
  runtime_constraint: RuntimeConstraint;
  runtime_constraint_course: RuntimeConstraintCourse;
  runtime_constraint_question: RuntimeConstraintQuestion;
  runtime_constraint_test: RuntimeConstraintTest;
  scale: Scale;
  scale_item: ScaleItem;
  semester: Semester;
  sql_question_answer: SqlQuestionAnswer;
  "stash.bodovi7za2lv": StashBodovi7za2lv;
  "stash.bodovi7zalv2": StashBodovi7zalv2;
  "stash.bodoviza2lv": StashBodoviza2lv;
  "stash.bodoviza3lvibias": StashBodoviza3lvibias;
  "stash.paper_upro_zi_ti": StashPaperUproZiTi;
  "stash.paper_upro_zi_tiq": StashPaperUproZiTiq;
  "stash.paper_upro_zir_ti": StashPaperUproZirTi;
  "stash.paper_upro_zir_tiq": StashPaperUproZirTiq;
  student: Student;
  student_course: StudentCourse;
  student_token: StudentToken;
  teacher_lecture_quiz_instance: TeacherLectureQuizInstance;
  temp_dontdelete: TempDontdelete;
  test: Test;
  test_correction: TestCorrection;
  test_instance: TestInstance;
  test_instance_gen_lock: TestInstanceGenLock;
  test_instance_question: TestInstanceQuestion;
  test_instance_question_comp_score: TestInstanceQuestionCompScore;
  test_instance_question_generated: TestInstanceQuestionGenerated;
  test_instance_question_manual_grade: TestInstanceQuestionManualGrade;
  test_instance_question_run: TestInstanceQuestionRun;
  test_instance_room: TestInstanceRoom;
  test_message: TestMessage;
  test_pace: TestPace;
  test_part: TestPart;
  test_question: TestQuestion;
  test_type: TestType;
  text_question_answer: TextQuestionAnswer;
  ticket: Ticket;
  ticket_message: TicketMessage;
  ticket_policy: TicketPolicy;
  ticket_subscription: TicketSubscription;
  tutorial: Tutorial;
  tutorial_code_question_hint: TutorialCodeQuestionHint;
  tutorial_course: TutorialCourse;
  tutorial_question_hint: TutorialQuestionHint;
  tutorial_step: TutorialStep;
  tutorial_step_hint: TutorialStepHint;
  tutorial_student: TutorialStudent;
  tutorial_student_question: TutorialStudentQuestion;
  tutorial_student_question_attempt: TutorialStudentQuestionAttempt;
  tutorial_ticket: TutorialTicket;
  tutorial_ticket_message: TutorialTicketMessage;
  tutorial_ticket_subscription: TutorialTicketSubscription;
  upro_schedule_set_test_params: UproScheduleSetTestParams;
  v_calib_question_answer: VCalibQuestionAnswer;
  v_d3tree: VD3tree;
  v_exercise_question: VExerciseQuestion;
  v_node_path: VNodePath;
  v_node_tree: VNodeTree;
  v_peer_shuffle: VPeerShuffle;
  v_roots_children: VRootsChildren;
  v_student_question_instance_answer: VStudentQuestionInstanceAnswer;
  v_student_question_instance_correct: VStudentQuestionInstanceCorrect;
  v_student_total_score: VStudentTotalScore;
  v_test_stats: VTestStats;
  v_tmp: VTmp;
  versions: Versions;
}
