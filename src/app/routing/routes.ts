/**
 * Define all routes in the app
 */
const routes: IRoutes = {
  home: "/",
  about: "/about",
  login: "/login",
  logout: "/logout",
  unauthorized: "/oops",
  pageNotFound: "/notfound",
  request: {
    start: "/request",
    foodbox: "/request/foodbox",
    success: {
      donation: "/request/foodbox/success/donation",
      payment: "/request/foodbox/success/payment",
    },
    error: "/request/foodbox/error",
  },
  donate: "/donate",

  recipient: {
    dashboard: {
      home: "/recipient",
      submitted: "/recipient/submitted",
      completed: "/recipient/completed",
    },
  },

  missions: {
    details: "/missions/:id",
    createdByUser: "/missions/created",
    createNew: "/missions/new",
    completed: "/missions/completed",
    delivered: "/missions/delivered",
  },

  organizer: {
    signup: "/organizer/signup",
    dashboard: {
      home: "/dashboard",
      missions: "/dashboard/missions",
      recipients: "/dashboard/recipients",
      volunteers: "/dashboard/volunteers",
    },
  },

  user: {
    signup: "/signup",
    profile: "/user/profile",
  },

  volunteer: {
    status: "/status",
    dashboard: {
      home: "/missions",
    },
  },
};

export type IRoute = string;
export interface IRoutes {
  [key: string]: IRoute | IRoutes | any;
}
export default routes;
