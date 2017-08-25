import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ValidationError = ({ uniqueA11yId, errorText, isWide, forceWrap }) => {
  const errorClass = classNames(
    'kno-validation',
    {
      'wide-message': isWide
    },
    {
      'kno-normal-wrap': forceWrap
    }
  );

  return (
    <div className={errorClass}>
      <span className="pull-left" id={uniqueA11yId}>
        {errorText}
      </span>
    </div>
  );
};

ValidationError.propTypes = {
  errorText: PropTypes.string.isRequired,
  uniqueA11yId: PropTypes.string.isRequired,
  isWide: PropTypes.bool,
  forceWrap: PropTypes.bool
};

ValidationError.displayName = 'ValidationError';

export default ValidationError;
