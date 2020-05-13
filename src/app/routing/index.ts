import routes from "./routes";
import { getLinkWithQuery } from "./services/utils";
import AppRoute from "./components/AppRoute";
import RoutingService from "./services/RoutingService";

export { routes, getLinkWithQuery, AppRoute, RoutingService };

export type IRoutes = import("./routes").IRoutes;
export type IRoute = import("./routes").IRoute;
