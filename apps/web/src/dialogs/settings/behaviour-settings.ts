/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2023 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import { DATE_FORMATS } from "@notesnook/core";
import { SettingsGroup } from "./types";
import { useStore as useSettingStore } from "../../stores/setting-store";
import dayjs from "dayjs";
import { isUserPremium } from "../../hooks/use-is-user-premium";
import { TimeFormat } from "@notesnook/core";
import { TrashCleanupInterval } from "@notesnook/core";

export const BehaviourSettings: SettingsGroup[] = [
  {
    key: "general",
    section: "behaviour",
    header: "General",
    isHidden: () => !isUserPremium(),
    settings: [
      {
        key: "default-homepage",
        title: "Home page",
        description: "Default screen to open on app startup.",
        keywords: ["welcome page", "default screen"],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.homepage, listener),
        components: [
          {
            type: "dropdown",
            onSelectionChanged: (value) =>
              useSettingStore.getState().setHomepage(parseInt(value)),
            selectedOption: () =>
              useSettingStore.getState().homepage.toString(),
            options: [
              { value: "0", title: "Notes" },
              { value: "1", title: "Notebooks" },
              { value: "2", title: "Favorites" },
              { value: "3", title: "Tags" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "date-time",
    section: "behaviour",
    header: "Date & time",
    settings: [
      {
        key: "date-format",
        title: "Date format",
        description: "This date format will be used everywhere in the app.",
        keywords: [],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.dateFormat, listener),
        components: [
          {
            type: "dropdown",
            onSelectionChanged: (value) =>
              useSettingStore.getState().setDateFormat(value),
            selectedOption: () => useSettingStore.getState().dateFormat,
            options: DATE_FORMATS.map((a) => ({
              value: a,
              title: `${a} (${dayjs(Date.now()).format(a)})`
            }))
          }
        ]
      },
      {
        key: "time-format",
        title: "Time format",
        description: "This time format will be used everywhere in the app.",
        keywords: [],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.timeFormat, listener),
        components: [
          {
            type: "dropdown",
            onSelectionChanged: (value) =>
              useSettingStore.getState().setTimeFormat(value as TimeFormat),
            selectedOption: () => useSettingStore.getState().timeFormat,
            options: [
              { value: "12-hour", title: "12h" },
              { value: "24-hour", title: "24h" }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "trash",
    section: "behaviour",
    header: "Trash",
    settings: [
      {
        key: "trash-cleanup-interval",
        title: "Cleanup interval",
        description:
          "All items in the trash will be permanently deleted after this interval.",
        keywords: ["clear trash", "trash cleanup interval"],
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.trashCleanupInterval, listener),
        components: [
          {
            type: "dropdown",
            onSelectionChanged: (value) =>
              useSettingStore
                .getState()
                .setTrashCleanupInterval(
                  parseInt(value) as TrashCleanupInterval
                ),
            selectedOption: () =>
              useSettingStore.getState().trashCleanupInterval.toString(),
            options: [
              { value: "1", title: "Daily" },
              { value: "7", title: "7 days" },
              { value: "30", title: "30 days" },
              { value: "365", title: "365 days" },
              { value: "-1", title: "Never", premium: true }
            ]
          }
        ]
      }
    ]
  },
  {
    key: "desktop-app",
    section: "behaviour",
    header: "Desktop app",
    isHidden: () => !IS_DESKTOP_APP,
    settings: [
      {
        key: "auto-updates",
        title: "Automatic updates",
        description:
          "Automatically download & install updates in the background without prompting first.",
        onStateChange: (listener) =>
          useSettingStore.subscribe((s) => s.autoUpdates, listener),
        isHidden: () => useSettingStore.getState().isFlatpak,
        components: [
          {
            type: "toggle",
            isToggled: () => useSettingStore.getState().autoUpdates,
            toggle: () => useSettingStore.getState().toggleAutoUpdates()
          }
        ]
      }
    ]
  }
];
