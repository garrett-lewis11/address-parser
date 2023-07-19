import fs from 'fs';
import * as XLSX from 'xlsx';

const { getByCityState, getByStateCity, getByZip } = require('zcs').zcs({});
const addresser = require('addresser');

const columns = ['First Name', 'Last Name', 'Address Line 1', 'Address Line 2', 'City', 'State', 'Zip'];

interface Row {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

const files = fs.readdirSync('./');

const spreadsheets = files.filter((f) => ['xlsx', 'xls'].includes(f.split('.')[1]));

spreadsheets.forEach((s) => {
  let rows: Row[] = [];

  let rawData = XLSX.readFile(`./${s}`);

  const data = XLSX.utils.sheet_to_json<{ Name: string; 'Primary Address': string }>(rawData.Sheets['Sheet1']);

  rows = data.map((d) => {
    const names = d.Name;
    const firstName = names.split(',')[1].trim();
    const lastName = names.split(',')[0].trim();
    let address = d['Primary Address'];

    const numberRegex = /[0-9]/g;
    if (!numberRegex.test(address.split(' ')[address.split(' ').length - 1])) {
      // no Zip code
      address += ' 0';
    }
    const addressComps = address.split(' ');

    let zip = addressComps.pop() || '';
    const state = addressComps.pop();

    let city = '';
    let cityTry = addressComps.pop()?.replace(',', '') || '';
    while (!city && addressComps.length) {
      try {
        city = getByStateCity(state, cityTry) ? cityTry : '';
      } catch {
        // Not valid city, keep trying
        if (
          ['ave', 'rd', 'dr', 'tr', 'blvd'].includes(addressComps[addressComps.length - 1].toLowerCase()) ||
          cityTry.split(' ').length >= 3
        ) {
          try {
            city = getByZip(zip.split('-')[0]).city;
          } catch (e) {
            console.error(`${e}: ${addressComps.join(' ')}`);
            city = 'UNKOWN';
          }
          if (city) {
            break;
          }
        }
        cityTry = `${addressComps.pop()} ${cityTry}`;
      }
    }

    let fullyParsed: any = null;

    if (zip.trim() === '0') {
      zip = '';
    }

    try {
      fullyParsed = addresser.parseAddress(`${addressComps.join(' ')}, ${city}, ${state} ${zip || ''}`);
    } catch (e) {
      console.error(`${e}: ${addressComps.join(' ')}, ${city}, ${state} ${zip || ''}`);
    }

    let addressLine1, addressLine2;

    if (fullyParsed) {
      addressLine1 = fullyParsed.addressLine1;
      addressLine2 = fullyParsed.addressLine2 || '';
    } else {
      [addressLine1, addressLine2] = addressComps.join(' ').split(',');
    }

    return {
      firstName,
      lastName,
      addressLine1: addressLine1 || '',
      addressLine2: addressLine2 || '',
      city,
      state: state || '',
      zip
    };
  });

  /* generate workbook */
  const wb = XLSX.utils.book_new();

  const sheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');

  XLSX.writeFile(wb, `./formatted_${s}`);
});
