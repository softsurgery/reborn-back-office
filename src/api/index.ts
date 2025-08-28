import { admin } from "./admin";
import { auth } from "./auth";
import { bug } from "./bug";
import { feedback } from "./feedback";
import { job } from "./job";
import { jobTag } from "./job-tag";
import { jobCategory } from "./job-category";
import { _public } from "./public";
import { upload } from "./upload";
import { store } from "./store";

export const api = {
  admin,
  _public,
  auth,
  feedback,
  bug,
  upload,
  job,
  jobTag,
  jobCategory,
  store,
};
