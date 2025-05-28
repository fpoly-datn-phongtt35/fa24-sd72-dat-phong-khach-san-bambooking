export const roles = {
  SYSADMIN: "Sysadmin",
  ADMIN: "Admin",
  USER: "User",
};
export const permissions = {
  VIEW_HOME: "view_home",
  VIEW_BOOKING: "view_booking",
  VIEW_BOOKING_MANAGEMENT: "view_booking_management",
  VIEW_CHECKIN: "view_checkin",
  VIEW_ROOM: "view_room",
  VIEW_TYPE_ROOM: "view_type_room",
  VIEW_MATERIALS: "view_materials",
  VIEW_CHECK_ROOM: "view_check_room",
  VIEW_SERVICE: "view_service",
  VIEW_INVOICE: "view_invoice",
  VIEW_EMPLOYEE: "view_employee",
};

export const rolePermissions = {
  [roles.ADMIN]: [
    permissions.VIEW_HOME,
    permissions.VIEW_BOOKING,
    permissions.VIEW_BOOKING_MANAGEMENT,
    permissions.VIEW_CHECKIN,
    permissions.VIEW_CHECK_ROOM,
    permissions.VIEW_SERVICE,
    permissions.VIEW_INVOICE,
  ],
  [roles.SYSADMIN]: Object.values(permissions),
};
