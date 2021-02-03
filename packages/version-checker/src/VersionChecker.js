import React, { useEffect, useState } from 'react';
import Visibility from 'visibilityjs';
import PropTypes from 'prop-types';

const Maintenance = ({ maintenancePage: UnderMaintenance }) => {
  if (!UnderMaintenance) return null;
  return <UnderMaintenance />;
};

const VersionChecker = props => {
  return children;
};

VersionChecker.propTypes = {
  url: PropTypes.string,
  mode: PropTypes.string,
};

export default VersionChecker;
