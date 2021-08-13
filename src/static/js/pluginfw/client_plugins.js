'use strict';

const pluginUtils = require('./shared');
const defs = require('./plugin_defs');

exports.baseURL = '';

exports.ensure = (cb) => !defs.loaded ? exports.update(cb) : cb();

exports.update = async (modules) => {
  const data = await jQuery.getJSON(
      `${exports.baseURL}pluginfw/plugin-definitions.json?v=${clientVars.randomVersionString}`);
  defs.plugins = data.plugins;
  defs.parts = data.parts;
  defs.hooks = pluginUtils.extractHooks(defs.parts, 'client_hooks', null, modules);
  defs.loaded = true;
};

const adoptPluginsFromAncestorsOf = (frame) => {
  // Bind plugins with parent;
  let ancestorPluginDefs = null;
  try {
    while (frame !== frame.parent && (frame = frame.parent) && ancestorPluginDefs == null) {
      ancestorPluginDefs = frame.pluginDefs;
    }
  } catch (error) {
    // Silence (this can only be a XDomain issue).
    console.error(error);
  }

  if (!ancestorPluginDefs) throw new Error('Parent plugins could not be found.');

  defs.hooks = ancestorPluginDefs.hooks;
  defs.loaded = ancestorPluginDefs.loaded;
  defs.parts = ancestorPluginDefs.parts;
  defs.plugins = ancestorPluginDefs.plugins;
  const ancestorPlugins = frame.plugins;
  exports.baseURL = ancestorPlugins.baseURL;
  exports.ensure = ancestorPlugins.ensure;
  exports.update = ancestorPlugins.update;
};

exports.adoptPluginsFromAncestorsOf = adoptPluginsFromAncestorsOf;
