import { admin } from "./admin";
import { auth } from "./auth";
import { bug } from "./bug";
import { feedback } from "./feedback";
import { job } from "./job";
import { jobTag } from "./job-tag";
import { _public } from "./public";
import { upload } from "./upload";

export const api = {
  admin,
  _public,
  auth,
  feedback,
  bug,
  upload,
  job,
  jobTag
};
