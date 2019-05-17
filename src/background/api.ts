import { browser, Tabs } from "webextension-polyfill-ts";
import domains from "./domains";

export const getCurrentTab = async (): Promise<Tabs.Tab> => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  if (tabs && tabs.length) {
    return tabs[0];
  } else {
    return void 0;
  }
};

export const watchTabChange = (handler: () => void): (() => void) => {
  const updateHandler = (_, changeInfo) => {
    if (changeInfo.url || changeInfo.title) {
      handler();
    }
  };
  browser.windows.onFocusChanged.addListener(handler);
  browser.tabs.onHighlighted.addListener(handler);
  browser.tabs.onUpdated.addListener(updateHandler);
  return () => {
    browser.windows.onFocusChanged.removeListener(handler);
    browser.tabs.onHighlighted.removeListener(handler);
    browser.tabs.onUpdated.removeListener(updateHandler);
  };
};

const getCeronUrl = (url: string): string => {
  return "https://ceron.jp/url/" + escape(url.replace(/^http(s*)\:\/\//, ""));
};

export const openCeron = (url: string, openerTabId?: number) => {
  browser.tabs.create({
    url: getCeronUrl(url),
    openerTabId
  });
};

export const isCeronTarget = (url: string): boolean => {
  const p = url.replace(/^http(s*)\:\/\//, "");
  return !!domains.find(d => p.startsWith(d));
};

const reg = /<meta name="description" content="\[(\d+)件のコメント\]/;
export const fetchCeron = async (url: string): Promise<number> => {
  try {
    const res = await fetch(getCeronUrl(url));
    const text = await res.text();
    const match = reg.exec(text);
    if (match && match.length > 1) {
      return +match[1];
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
};

const getColor = (num: number): string => {
  console.log(num);
  if (num > 500) {
    return "#900";
  } else if (num > 100) {
    return "#c60";
  } else if (num > 20) {
    return "#ca0";
  } else {
    return "#66f";
  }
};

export const enableBadge = (count: number, tabId?: number) => {
  browser.browserAction.setBadgeBackgroundColor({
    color: getColor(count)
  });
  browser.browserAction.setBadgeText({
    text: count + "",
    tabId
  });
  browser.browserAction.enable(tabId);
};

export const disableBadge = (tabId?: number) => {
  browser.browserAction.disable(tabId);
};
