/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ads from "../ads.js";
import type * as automation from "../automation.js";
import type * as automationExecutions from "../automationExecutions.js";
import type * as careers from "../careers.js";
import type * as contacts from "../contacts.js";
import type * as crons from "../crons.js";
import type * as discordApplications from "../discordApplications.js";
import type * as lib_posthog from "../lib/posthog.js";
import type * as lib_tenantUtils from "../lib/tenantUtils.js";
import type * as lpAbTests from "../lpAbTests.js";
import type * as lpConfigs from "../lpConfigs.js";
import type * as lpValidation from "../lpValidation.js";
import type * as playbook from "../playbook.js";
import type * as playbooks from "../playbooks.js";
import type * as productRequests from "../productRequests.js";
import type * as products from "../products.js";
import type * as serviceApplications from "../serviceApplications.js";
import type * as systemAlerts from "../systemAlerts.js";
import type * as waitlist from "../waitlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ads: typeof ads;
  automation: typeof automation;
  automationExecutions: typeof automationExecutions;
  careers: typeof careers;
  contacts: typeof contacts;
  crons: typeof crons;
  discordApplications: typeof discordApplications;
  "lib/posthog": typeof lib_posthog;
  "lib/tenantUtils": typeof lib_tenantUtils;
  lpAbTests: typeof lpAbTests;
  lpConfigs: typeof lpConfigs;
  lpValidation: typeof lpValidation;
  playbook: typeof playbook;
  playbooks: typeof playbooks;
  productRequests: typeof productRequests;
  products: typeof products;
  serviceApplications: typeof serviceApplications;
  systemAlerts: typeof systemAlerts;
  waitlist: typeof waitlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
