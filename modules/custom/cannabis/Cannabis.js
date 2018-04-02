/**
 * Cannabis.js
 *
 * @desc Cannabis module
 * @license Private
 * @version 0.1
 */
'use strict';

let config = require('./config.js');
let rp = require('request-promise');
let helpers = require('../../Helpers.js');
var Cannabis = function() {};


/**
 * Masters and Master Channels
 *
 * MUST BE LOWERCASE!
 *
 * @description Global environment variables
 *
 */
Cannabis.state = {
  search: {}
};
Cannabis.urls = {
  base: "http://en.seedfinder.eu/api/json/",
  search: "search.json",
  strain: "strain.json",
  params: {
    api: "&ac={{API}}",
    search: "?q={{TERM}}",
    strain: "?br={{BREEDER}}&str={{STRAIN}}"
  }
};

/**
 * SeedFinder.eu search
 *
 * @description API Details: http://en.seedfinder.eu/api/json/
 */
Cannabis.sf_search = (client, message) => {
  let breeder;
  let chan = message.args[0];
  let matches = [];
  let strain;
  let terms = message.args[1].trim().split(' ');
  let url = "";
  let total_terms;

  // Manipulate
  terms.shift(); // remove the command
  terms = terms.join(' ').split(":");
  total_terms = terms.length;
  strain = (terms instanceof Array) ? terms[0].trim() : terms.trim();
  breeder = ((terms instanceof Array) && (total_terms>1)) ? terms[1].trim() : '';
  url += Cannabis.urls.base;
  url += Cannabis.urls.search;
  url += Cannabis.urls.params.search;
  url += Cannabis.urls.params.api;
  url = url.replace('{{TERM}}', encodeURI(strain));
  url = url.replace('{{API}}', config.sf_api_key);

  // Store in state to be accessible later
  Cannabis.state.search = {
    strain: strain,
    breeder: breeder,
    matches: []
  };

  console.log("Searching SeedFinder, assuming strain is '%s' and breeder is '%s'", strain, breeder);
  console.log(url);
  rp(url)
    .then(function(body) {
      body = JSON.parse(body);
      let breeder;
      let obj;
      let prop;
      let results;
      let results_array = [];
      let search_response;
      let strain;

      if (body.error || !body) {
        console.log('ERR! Seedfinder gave us back an error, or sent nothing back.');
        return console.log(body.error);
      }

      console.log("Got %d results... ", body.count);

      // Manipulate
      breeder = Cannabis.state.search.breeder;
      strain = Cannabis.state.search.strain;

      // Have results
      if (body.count !== 0) {
        results = body.strains;

        console.log('Iterating...');

        Object.keys(results).forEach((key) => {
          // let matches = [];
          let result = results[key];
          let result_strain = result.name.toLowerCase();
          let result_breeder = result.brname.toLowerCase();
          let matchedStrain = (result_strain.search(strain) > -1);
          let matchedBreeder = (result_breeder.search(breeder) > -1);
          let matchedStrainAndBreeder = (matchedStrain && breeder && matchedBreeder);
          let matchedOnlyStrain = (matchedStrain && (!breeder || matchedBreeder));

          results_array.push( result );

          // console.log(result_strain.search( strain ));
          if (matchedOnlyStrain || matchedStrainAndBreeder) {
            Cannabis.state.search.matches.push(result);
          }

          /*
          else if (matchedStrain && breeder && !matchedBreeder) {
            // console.log('matched strain (%s <> %s), but not breeder (%s <> %s)', strain, result_strain, breeder, result_breeder);
            // console.log(result);
          } else if (!matchedStrain && breeder && matchedBreeder) {
            // console.log('matched breeder... %s <> %s ', breeder, result_breeder);
            // console.log(result);
          } else {
            // console.log('Didnt match strain (%s <> %s), nor breeder (%s <> %s)', strain, result_strain, breeder, result_breeder);
          }
          */
        });

        if (Cannabis.state.search.matches.length) {
          search_response = "Found "+body.count+" result(s). Here's my best guess:";
          console.log('Cannabis.sf_search(): Got %d results and have %d matches', body.count, Cannabis.state.search.matches.length);
          console.log('Cannabis.sf_search(): Telling chan %s', chan);
          client.say(chan, search_response);

          Cannabis.sf_get_strain( client, chan );
          return true;
        }
        else {
          let nonmatches = results_array.length;
          let response = "Hmm... Got back ";
          response += (nonmatches > 0) ? "'" + results_array[0].name + "' by " + results_array[0].brname + ", " : "some results ";
          response += (nonmatches > 1) ? "'" + results_array[1].name + "' by " + results_array[1].brname + ", " : "";
          response += (nonmatches > 2) ? "'" + results_array[2].name + "' by " + results_array[2].brname + ", " : "";
          response += (nonmatches > 3) ? "'" + results_array[3].name + "' by " + results_array[3].brname + ", " : "";
          response += (nonmatches > 4) ? "and more " : "";
          response += "but couldn't match any to your search. fml, I give up.";

          console.log("Cannabis.sf_search(): Couldnt match anything. Responding to %s with response: '%s'", chan, response);
          client.say( chan, response );
        }
      }
      else {
        // Send to IRC
        client.say(chan, "Sorry, no results.");
        return false;
      }
    })
    .catch(function(err) {
      // Crawling failed...
      console.log('Cannabis.sf_search(): ACK! SeedFinder search failed.');
      console.log('ERR!', err);
      throw err;
    });
  return true;
}

/**
 * sf_get_strain()
 *
 * @description SeedFinder.eu strain detail finder
 */
Cannabis.sf_get_strain = ( client, chan ) => {
  let url = "";
  let breeder;
  let strain;
  let matches = [];
  let match = Cannabis.state.search.matches[0];

  // Build
  url += Cannabis.urls.base;
  url += Cannabis.urls.strain;
  url += Cannabis.urls.params.strain;
  url += Cannabis.urls.params.api;

  // Manipulate
  url = url.replace('{{STRAIN}}', encodeURI(match.id));
  url = url.replace('{{BREEDER}}', encodeURI(match.brid));
  url = url.replace('{{API}}', config.sf_api_key);

  console.log("Cannabis.sf_get_strain(): Getting strain details for '%s' by %s (url: %s)", match.name, match.brname, url);

  // Send request
  return rp(url)
    .then(function(body) {
      // Instantiate vars
      let auto_string;
      let desc_length = 317;
      let match_out1;
      let match_out2;
      let match_out3;
      let results;

      // Setup JSON object
      body = JSON.parse(body);

      // Handle errors
      if (body.error || !body) {
        console.log('Cannabis.sf_get_strain(): ERR! Seedfinder strain search gave us back an error, or sent nothing back.');
        return console.log(body.error);
      }

      // @TODO These variables names deserve to be revisited
      // Build
      auto_string = (body.brinfo.flowering.auto) ? ' *AUTO*' : '';
      match_out1 = "{{STRAIN}}{{AUTO}} from {{BREEDER}} ({{TYPE}}, Flower time: ~{{FLOWER}} days)";
      match_out2 = "{{URL}}";
      match_out3 = "{{DESC}}";

      // Manipulate
      match_out1 = match_out1.replace("{{STRAIN}}", body.name);
      match_out1 = match_out1.replace("{{AUTO}}", auto_string);
      match_out1 = match_out1.replace("{{BREEDER}}", body.brinfo.name);
      match_out1 = match_out1.replace("{{TYPE}}", body.brinfo.type);
      match_out1 = match_out1.replace("{{FLOWER}}", body.brinfo.flowering.days);
      match_out2 = match_out2.replace("{{URL}}", body.links.info);
      match_out3 = match_out3.replace("{{DESC}}", body.brinfo.descr.replace(/<\/?[^>]+(>|$)/g, "").substr(0, desc_length) + '...');
      results = [
        match_out1,
        match_out2,
        match_out3
      ];

      // Send messages
      return helpers.dripReply(client, chan, results);
    }).catch((err)=> {
      console.log('Cannabis.sf_get_strain(): ACK! Error fetching strain %s', match.name);
      throw err;
    });
}

module.exports = Cannabis;