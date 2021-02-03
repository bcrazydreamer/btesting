import React, { useEffect, useState } from 'react';
import Visibility from 'visibilityjs';
import PropTypes from 'prop-types';

const Maintenance = ({ maintenancePage: UnderMaintenance }) => {
  if (!UnderMaintenance) return null;
  return <UnderMaintenance />;
};

const checkVersion = meta => {
  if (!meta) return;
  const { version: curVer, hash: curHsh } = window.__app_meta || {};
  const { version: newVer, hash: newHsh, maintenance = false } = meta;
  const versionChanged =
    !!window.__app_meta && (newVer !== curVer || newHsh !== curHsh);
  // update existing meta
  window.__app_meta = meta;
  if (versionChanged) return window.location.reload();
  return maintenance || versionChanged;
};

const fetchAndCheckVersion = (setMaintenance, url) => {
  return window
    .fetch(`${url}?ts=${new Date().getTime()}`)
    .then(response => {
      if (!response.ok) throw new Error('__app_meta fetch failed');
      let resp = response;
      try {
        resp = response.json();
      } catch (err) {
        console.log(err);
      }
      return resp;
    })
    .then(checkVersion)
    .then(setMaintenance)
    .catch(e => console.error(e));
};

const VersionChecker = props => {
  const { children, mode, maintenancePage, url } = props;
  const [maintenance, setMaintenance] = useState(false);
  useEffect(() => {
    if (mode !== 'production') return;
    if (!window.__app_meta)
      // first load, fetch blindly
      fetchAndCheckVersion(setMaintenance, url);

    // every time user returns to the tab, fetch and check
    const listener = Visibility.change((e, state) => {
      if (state !== 'visible') return;
      fetchAndCheckVersion(setMaintenance);
    });
    return () => Visibility.unbind(listener);
  }, []);

  if (maintenance) return <Maintenance maintenancePage={maintenancePage} />;
  return children;
};

VersionChecker.defaultProps = {
  url: '/__app_meta.json',
  mode: 'development',
};

VersionChecker.propTypes = {
  url: PropTypes.string,
  mode: PropTypes.string,
};

export default VersionChecker;
