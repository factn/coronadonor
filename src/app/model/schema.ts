export type ImageUrl = string;

export interface Location {
  /* The address represent the location - parseable by geolocation */
  address: string;
  /* Latitude */
  lat: number;
  /* Longtitude */
  lng: number;
  /*  eg Pepperige farms if relevant */
  label: string;
}

export class Resource {
  id!: string;
  name!: string;
  cost!: number;
  fundedByRecipient: number = 0;
  fundedByDonation: number = 0;
  notFunded: number = 3;
  maxNumberRequestable: number = 50;
  acceptOrder: boolean = false;
  description: string = "";
}

// ===== Organization ====
export class OrganizationInterface {
  /* Firebase Id, created automatically*/
  id!: string;
  /*Name of the organization */
  name!: string;
  /*The Location of the Organization*/
  location?: Location;
  /**
   * There are subcollection, they are here for references
  resources?: Map<string, Resource>;
  missions: Map<string, MissionInterface> = new Map();
  users: Map<string, UserInterface> = new Map();
  */
}

// === USER ===

/*Volunteer status when first signup to a organization*/
export enum VolunteerStatus {
  created = "created", // when user first created an account
  // once user accept term and conditions -> pending
  pending = "pending", // waiting for organization to approve the request
  // once the organization accept, -> approved
  // if not accepted -> declined
  approved = "approved", // you are a volunteer
  declined = "declined", // sorry
}

export class UserInterface {
  id!: string;
  /* phone number, our primary means of communication
  FIXME: need to ensure this is synced from firebase.auth ph number
  FIXME: where do we assert phone number formatting?
  FIXME: currently, always null */
  phone!: string;
  email!: string;
  /* user's selected profile image url
  FIXME: need to sync this with state.firebase.profile.photoURL ?
  */
  photoURL?: ImageUrl;
  /* user profile name, this populate from either user, or his provider*/
  displayName?: string;
  /* from the 'Tell us about yourself' form field */
  description?: string;
  /* user location, we use this to show user on a map */
  location?: Location;
  /* the organization that user belong to*/
  organizationId!: number;
  /* if user is a volunteer */
  isVolunteer!: boolean;
  /* if user is an organizer */
  isOrganizer!: boolean;
  /* if user can receive texts */
  cannotReceiveTexts!: boolean;
  /* specific details for the volunteer */
  volunteerDetails!: {
    /*user hours */
    availability: string;
    /*if user have transportation */
    hasTransportation: boolean;
    /*user volunteering to an organization have a pending status*/
    status: VolunteerStatus;
    privateNotes: string;
  };
  /* specific details for the organizer*/
  organizerDetails!: {};
}

//===== Mission =====//
export enum MissionStatus {
  unassigned = "unassigned",

  tentative = "tentative",
  assigned = "assigned",
  accepted = "accepted",

  started = "started",
  delivered = "delivered",

  succeeded = "succeeded",
  failed = "failed",
}

export enum MissionFundedStatus {
  notfunded = "notfunded",
  fundedbyrecipient = "fundedbyrecipient",
  fundedbydonation = "fundedbydonation",
  fundingnotneeded = "fundingnotneeded",
}

export enum MissionType {
  foodbox = "foodbox",
  pharmacy = "pharmacy",
  errand = "errand",
}

export enum TimeWindowType {
  exact = "exact", //exact time specfied
  morning = "morning",
  afternoon = "afternoon",
  wholeday = "wholeday",
  asap = "as soon as possible",
  whenever = "whenever possible",
}

// delivery windows for the organisation
// for MVP.0 we have a fixed function ie hardcode a list of available delivery windows

export interface TimeWindow {
  timeWindowType: TimeWindowType;
  startTime: string; // actually date time
}

export interface MissionLogEvent {
  id: string;
  actorId: string;
  action: string;
  actionDetail?: string;
  fieldName?: string;
  newValue: any;
  timestamp: string;
}

export interface Box {
  name: string;
  details: string;
}

export interface FoodBoxDetails {
  needs: Array<Box>;
}

export interface MissionInterface {
  id: string;
  type: MissionType;

  missionDetails: FoodBoxDetails | {};

  status: MissionStatus;
  fundedStatus: MissionFundedStatus;
  readyStatus: boolean;
  organisationId: string;
  tentativeVolunterId: string; // this get removed if the volunteer accepts?
  volunteerId: string;

  pickUpWindow: TimeWindow | null; // nb this can be an exact time or can be null
  pickUpLocation: Location;

  deliveryWindow: TimeWindow | null;
  deliveryLocation: Location; // default to recipient location
  deliveryConfirmationImage: ImageUrl;
  deliveryNotes: string;

  feedbackNotes: string;

  recipientName: string;
  recipientPhoneNumber: string;
  recipientId: string; // reference?
  // all other event log type stuff, such as when assigned etc belongs in the eventlog
  // this should be a child collection
  //@SubCollection(MissionLogEvent)
  //eventlog?: ISubCollection<MissionLogEvent>;
}
