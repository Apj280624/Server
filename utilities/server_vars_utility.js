const vars = {
  OTPExpirationDurationInSeconds: 5 * 60,
  OTPOldDurationInSeconds: 2 * 60 * 60,
  TokenExpirationDurationInSeconds: 5 * 24 * 60 * 60,
  saltRounds: 10,
};

const routes = {
  SIGN_UP: "/auth/sign-up",
  SIGN_IN: "/auth/sign-in",
  FORGOT_PASSWORD: "/auth/forgot-password",
  VOTP: "/auth/votp",
  FOTP: "/auth/fotp",

  VERIFY_TOKEN: "/verify-token",
  CONTRIBUTE: "/contribute",

  INTERVIEW_EXPERIENCES: "/interview-experiences",
  INTERVIEW_EXPERIENCE_EDIT: "/interview-experience/edit",
  INTERVIEW_EXPERIENCE_DELETE: "/interview-experience/delete",

  ACCOUNT: "/account",
  PARTICULAR_INTERVIEW_EXPERIENCE: "/particular-interview-experience",
};

/* 
READ is used by two routes one for account read, one for normal read, its present on client as well as server side
that's why the route name isn't prefixed with account as in EDIT 

PARTICULAR_INTERVIEW_EXPERIENCE is used inside the read route to get interview experience and display it on the
READ route, 
PARTICULAR INTERVIEW EXPERIENCE route is not on the client side

*/

const statusText = {
  SIGN_IN_SUCCESS: "You have been signed in successfully",
  SIGN_IN_FAIL: "We were to unable to sign you in. Please try again",
  SIGN_UP_SUCCESS: "You have been signed up successfully",
  SIGN_UP_FAIL: "We were to unable to sign you up. Please try again",

  PASSWORD_UPDATE_FAIL:
    "We were to unable to update your password. Please try again",
  PASSWORD_UPDATE_SUCCESS: "Your password has been updated successfully",

  USER_NOT_FOUND: "We were to unable to find any user with these credentials",
  USER_EMAIL_EXISTS: "A user with this Email Address already exists",
  EMAIL_ALREADY_EXISTS: "A user with this Email Address already exists",
  EMAIL_NOT_FOUND:
    "We couldn't find any user associated with this Email address",

  EMAIL_SEND_FAIL: "We were unable to send an Email",
  EMAIL_SEND_SUCCESS: "OTP has been sent successfully",

  ////////////////////////////////////////////////////////////////////////////////////////////////

  OTP_VERIFICATION_FAIL: "We were unable to verify the OTP. Please try again",
  OTP_NOT_OURS: "The OTP that you have entered was not generated by us",
  OTP_EXPIRED: "OTP has been expired",
  OTP_WRONG: "You have entered a wrong OTP",
  OTP_SEND_FAIL: "We were unable to send OTP. Please try again",
  OTP_SEND_SUCCESS: "An Email with the OTP has been sent successfully",

  ////////////////////////////////////////////////////////////////////////////////////////////////

  SOMETHING_WENT_WRONG: "Something went wrong, Please try again",
  NOT_AUTHORIZED: "You're not authorized to see this page. Please sign in",

  /////////////////////////////////////////////////////////////////////////////////////////////////

  TOKEN_INVALID_CANNOT_CONTRIBUTE:
    "You're not signed in. Please sign in to contribute",
  TOKEN_INVALID_CANNOT_DISPLAY_ACCOUNT:
    "You're not signed in. Please sign in to see your account information",
  TOKEN_INVALID_CANNOT_EDIT: "You're not signed in. Please sign in to edit",
  TOKEN_INVALID_CANNOT_DELETE: "You're not signed in. Please sign in to delete",

  TOKEN_EXPIRED: "The session has expired. Please sign in again",
  TOKEN_VERIFIED: "You're are already signed in",

  //////////////////////////////////////////////////////////////////////////////////////////////////

  ACCOUNT_FETCH_FAILED:
    "We were unable to fetch your account information. Please try again",
  ACCOUNT_NOT_FOUND:
    "We were unable to find any account associated with this Email address",
  CONTRIBUTION_SUCCESS: "Your contribution has been added successfully",
  CONTRIBUTION_FAILED:
    "We were unable to add your contribution. Please try again",

  INTERVIEW_EXPERIENCE_EDIT_SUCCESS: "Changes have been saved successfully",
  INTERVIEW_EXPERIENCE_EDIT_FAILED:
    "We were unable to save changes to this interview experience. Please try again",
  INTERVIEW_EXPERIENCE_DELETE_SUCCESS:
    "Interview experience has been deleted successfully",
  INTERVIEW_EXPERIENCE_DELETE_FAILED:
    "We were unable to delete this interview experience. Please try again",

  /////////////////////////////////////////////////////////////////////////////////////////////////

  INTERVIEW_EXPERIENCES_NOT_FOUND:
    "We were unable to fetch any interview experiences. Please visit this section after sometime",
  INTERVIEW_EXPERIENCES_FOUND:
    "All the interview experiences were fetched successfully",
  INTERVIEW_EXPERIENCE_NOT_FOUND:
    "We were unable to fetch the interview experience. Please visit this section after sometime",
  INTERVIEW_EXPERIENCE_FOUND:
    "The interview experience was fetched successfully",
  UNABLE_TO_FIND_RESOURCE:
    "We were unable to fulfill the request. Please try again later",
};

module.exports = {
  routes,
  vars,
  statusText,
};
