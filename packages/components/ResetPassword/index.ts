import { withInstall } from "../../utils/install";
import ResetPassword from "./Index.vue";

export const ElResetPassword = withInstall(ResetPassword);
export default ElResetPassword;

export type { VerifyType, StepType, ResetFormData, ResetPasswordProps } from "./types";
