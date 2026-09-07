/**
 * Curated, license-free Unsplash placeholder photography used across the
 * marketing pages until the client uploads real photos/video through the
 * admin Media Library. Every image below has been verified to resolve.
 *
 * To swap: upload the real asset in /admin/media, then replace the constant
 * used on the relevant page/component with the Media document's `url`.
 */
function unsplash(id: string, width = 1600) {
  return `https://images.unsplash.com/${id}?q=80&w=${width}&auto=format&fit=crop`;
}

export const STOCK_IMAGES = {
  heroHome: unsplash('photo-1600585154340-be6161a56a0c', 1920),
  smartHomeLock: unsplash('photo-1558002038-1055907df827'),
  securityTechRoom: unsplash('photo-1573164713988-8665fc963095'),
  electricianAtPanel: unsplash('photo-1621905251189-08b45d6a269e'),
  electricianAlt: unsplash('photo-1621905251918-48416bd8575a'),
  solarField: unsplash('photo-1509391366360-2e959784a276'),
  renewableSunset: unsplash('photo-1466611653911-95081537e5b7'),
  handymanFaucet: unsplash('photo-1517646287270-a5a9ca602e5c'),
  technicianPortrait: unsplash('photo-1621905252507-b35492cc74b4'),
  trainingWorkshop: unsplash('photo-1581092160607-ee22621dd758'),
  interviewConversation: unsplash('photo-1573497491208-6b1acb260507'),
  officeHighFive: unsplash('photo-1600880292203-757bb62b4baf'),
  handshake: unsplash('photo-1521791136064-7986c2920216'),
} as const;
