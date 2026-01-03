export const OrgErrors = {
  notFound: "org.notFound",
  failedToLoad: "org.failedToLoad",
  failedToCreate: "org.failedToCreate",
  failedToUpdate: "org.failedToUpdate",
  failedToDelete: "org.failedToDelete",
  unauthorized: "org.unauthorized",
  slugAlreadyExists: "org.slugAlreadyExists",
} as const;

export const OrgMemberErrors = {
  failedToLoad: "org.members.failedToLoad",
  failedToUpdate: "org.members.failedToUpdate",
  failedToRemove: "org.members.failedToRemove",
  failedToAdd: "org.member.failedToAdd",
  unauthorized: "org.members.unauthorized",
  insufficientPermissions: "org.members.insufficientPermissions",
  loadError: "org.members.errors.loadError",
  alreadyMember: "org.member.alreadyMember",
} as const;

export const OrgLeaveErrors = {
  failedToCheckMembership: "org.leave.failedToCheckMembership",
  failedToLeave: "org.leave.failedToLeave",
  notMember: "org.leave.notMember",
  unauthorized: "org.leave.unauthorized",
} as const;

export const OrgInviteErrors = {
  failedToLoad: "org.invite.failedToLoad",
  failedToLoadUserInvites: "org.invite.failedToLoadUserInvites",
  failedToUpdate: "org.invite.failedToUpdate",
  failedToUpdateUserInvite: "org.invite.failedToUpdateUserInvite",
  failedToInsert: "org.invite.failedToInsert",
  failedToCheckUser: "org.invite.failedToCheckUser",
  failedToCreate: "org.invite.failedToCreate",
  unauthorized: "org.invite.unauthorized",
  notFound: "org.invite.notFound",
  invalidEmail: "org.invite.invalidEmail",
  alreadyMember: "org.invite.alreadyMember",
  expired: "org.invite.expired",
  revoked: "org.invite.revoked",
} as const;

export type OrgError = (typeof OrgErrors)[keyof typeof OrgErrors];
export type OrgMemberError =
  (typeof OrgMemberErrors)[keyof typeof OrgMemberErrors];
export type OrgLeaveError =
  (typeof OrgLeaveErrors)[keyof typeof OrgLeaveErrors];
export type OrgInviteError =
  (typeof OrgInviteErrors)[keyof typeof OrgInviteErrors];

export type OrganizationError =
  | OrgError
  | OrgMemberError
  | OrgLeaveError
  | OrgInviteError;
