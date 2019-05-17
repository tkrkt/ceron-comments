import { browser } from "webextension-polyfill-ts";
import {
  getCurrentTab,
  watchTabChange,
  fetchCeron,
  isCeronTarget,
  disableBadge,
  enableBadge,
  openCeron
} from "./api";

browser.browserAction.onClicked.addListener(tab => {
  openCeron(tab.url, tab.id);
});

// this extension is basically disabled
disableBadge();

watchTabChange(async () => {
  const tab = await getCurrentTab();
  if (!tab) {
    disableBadge();
    return;
  }

  if (isCeronTarget(tab.url)) {
    const count = await fetchCeron(tab.url);
    enableBadge(count, tab.id);
  } else {
    disableBadge(tab.id);
  }
});
