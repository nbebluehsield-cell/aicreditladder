/**
 * GA4 custom event names + shared param keys.
 *
 * In GA4: Admin → Custom definitions → create dimensions for params you care
 * about (e.g. offer_slug, vendor). Build Explorations: break down by
 * offer_slug, compare counts of view_offer vs offer_apply_outbound.
 */

export const GA_EVENTS = {
  /** Offer detail viewed (client, once per navigation). */
  VIEW_OFFER: "view_offer",
  /** User tapped a row to open an offer (from index / explore / home). */
  OFFER_CARD_CLICK: "offer_card_click",
  /** Anonymous user opened the email field on an offer. */
  OFFER_UNLOCK_OPEN: "offer_unlock_open",
  /** Magic-link email successfully requested for this offer. */
  OFFER_MAGIC_LINK_SENT: "offer_magic_link_sent",
  /** Signed-in user opened the vendor apply URL from an offer. */
  OFFER_APPLY_OUTBOUND: "offer_apply_outbound",
  /** Explore: submitted search. */
  EXPLORE_SEARCH: "explore_search",
  /** Explore: sort changed. */
  EXPLORE_SORT: "explore_sort",
  /** Explore: any filter chip / facet toggled (not sort/search). */
  EXPLORE_FILTERS: "explore_filters",
  /** Explore: copied full URL (filters + sort) to clipboard. */
  EXPLORE_COPY_VIEW: "explore_copy_view",
} as const;

export type OfferEventContext = {
  offer_slug: string;
  vendor: string;
  offer_title: string;
};
