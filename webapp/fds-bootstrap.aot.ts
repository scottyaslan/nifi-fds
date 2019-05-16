/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'core-js';
import 'zone.js';
import 'hammerjs';
import * as $ from 'jquery';
import {platformBrowser} from '@angular/platform-browser';
import {
    enableProdMode,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT,
    LOCALE_ID,
    PlatformRef
} from '@angular/core';
import FdsModule from 'webapp/fds.module.js';

enableProdMode();

const platform: PlatformRef = platformBrowser();

// Get the locale id from the global
const locale = navigator.language;

let providers: any[];
providers = [];

// No locale or U.S. English: no translation providers so go ahead and bootstrap the app
if (!locale || locale === 'en-US') {
    platform.bootstrapModule(FdsModule, {providers: providers});
} else { //load the translation providers and bootstrap the module
    var translationFile = '/locale/messages.' + locale + '.xlf';

    $.ajax({
        url: translationFile
    }).done(function (translations: any) {
        // add providers if translation file for locale is loaded
        if (translations) {
            providers.push({provide: TRANSLATIONS, useValue: translations});
            providers.push({provide: TRANSLATIONS_FORMAT, useValue: 'xlf'});
            providers.push({provide: LOCALE_ID, useValue: locale});
        }
        platform.bootstrapModule(FdsModule, {providers: providers});
    }).fail(function () {
        platform.bootstrapModule(FdsModule, {providers: providers});
    });
}