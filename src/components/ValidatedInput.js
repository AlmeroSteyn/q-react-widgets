import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import ValidationHOC from './ValidationHOC';
import ValidationError from './ValidationError';
import classNames from 'classnames';
import uuid from 'node-uuid';
// import { getAriaDescribedby } from '../../../utils/a11y';

export class ValidatedInput extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      elementValue: this.props.elementValue ? this.props.elementValue : '',
      uniqueA11yId: uuid.v4(),
      uniqueLabelId: uuid.v4(),
      uniqueCaptionId: uuid.v4(),
      uniqueA11yIdForPredictiveText: uuid.v4()

    };


    this.onChangeHandler = debounce(this.props.onChangeHandler, 250);
    this.internalOnChangeHandler = this.internalOnChangeHandler.bind(this);
    this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.elementValue !== nextProps.elementValue && this.state.elementValue !== nextProps.elementValue) {
      this.setState({
        elementValue: nextProps.elementValue ? nextProps.elementValue : ''
      });
    }
  }

  internalOnChangeHandler(e) {
    const value = e.target.value;

    this.setState({ elementValue: value }, () => {
      this.onChangeHandler({ target: { value } });
    });
  }

  onKeyDownHandler(e) {
    if (e.keyCode === 13) {
      this.onChangeHandler.cancel();
      this.props.onChangeHandler(e);
    }
  }

  onBlurHandler(e) {
    if (e.target.value !== this.props.elementValue && (e.target.value || this.props.elementValue)) {
      this.onChangeHandler.cancel();
      this.props.onChangeHandler(e);
    }
  }

  render() {
    const {
      disabled,
      name,
      maxLength,
      placeholder,
      type,
      inputClass,
      labelClass,
      labelText,
      errorText,
      wideError,
      displayValidation,
      required,
      readOnly,
      isTextArea,
      rows,
      a11yLabel,
      caption,
      predictiveAriaText,
      isHidden,
      showInputTextWhenDisabled,
      seleniumName,
      liveErrors
    } = this.props;
    const inputProps = {
      disabled,
      name,
      readOnly,
      maxLength,
      placeholder,
      type
    };
    const { uniqueA11yId, uniqueA11yIdForPredictiveText, uniqueLabelId, uniqueCaptionId } = this.state;

    const textAreaProps = Object.assign({}, inputProps, { rows });

    const showValidation = errorText && displayValidation;

    const formGroupClass = classNames('form-group', {
      'has-error': !!showValidation,
      'kno-hidden': isHidden
    });

    const inputClassString = classNames(inputClass ? inputClass : 'col-xs-8 col-md-9');

    const labelClassString = classNames(labelClass ? labelClass : 'col-xs-4 col-md-3', 'control-label', {
      required: required
    });

    // const ariaDescribedby = getAriaDescribedby({
    //   [uniqueA11yId]: showValidation,
    //   [uniqueCaptionId]: !!caption,
    //   [uniqueA11yIdForPredictiveText]: !!predictiveAriaText
    // });

    //TODO: Here onInput is used instead of onChange as in React 15, the onChange event swallows some characters
    //in IE 11 when used with debounce. Refer to https://github.com/facebook/react/issues/7027
    //Change back to onChange when React 16 is released.
    //The onChange handler with empty function call is necessary due to the unit tests failing
    //for a controlled input if it is absent.
    return (
      <div className={formGroupClass}>
        <label className={labelClassString} htmlFor={uniqueLabelId}>
          {labelText}
        </label>
        <div className={inputClassString}>
          {isTextArea
            ? !disabled || showInputTextWhenDisabled
              ? <textarea
                  id={uniqueLabelId}
                  className="form-control"
                  data-selenium-name={seleniumName ? seleniumName : null}
                  value={this.state.elementValue}
                  onInput={this.internalOnChangeHandler}
                  onChange={() => {}}
                  onBlur={this.onBlurHandler}
                  aria-readonly={readOnly ? 'true' : null}
                  aria-required={required ? 'true' : null}
                  aria-invalid={showValidation ? 'true' : null}
                  // aria-describedby={ariaDescribedby}
                  aria-label={a11yLabel ? a11yLabel : null}
                  {...textAreaProps}
                  style={{
                    resize: 'vertical'
                  }}
                />
              : <textarea value="" id={uniqueLabelId} className="form-control" disabled={disabled} rows={rows} />
            : !disabled || showInputTextWhenDisabled
              ? <input
                  id={uniqueLabelId}
                  className="form-control"
                  data-selenium-name={seleniumName ? seleniumName : null}
                  value={this.state.elementValue}
                  onInput={this.internalOnChangeHandler}
                  onChange={() => {}}
                  onKeyDown={this.onKeyDownHandler}
                  onBlur={this.onBlurHandler}
                  autoComplete="off"
                  aria-readonly={readOnly ? 'true' : null}
                  aria-required={required ? 'true' : null}
                  aria-invalid={showValidation ? 'true' : null}
                  // aria-describedby={ariaDescribedby}
                  aria-label={a11yLabel ? a11yLabel : null}

                  {...inputProps}
                />
              : <input id={uniqueLabelId} value="" className="form-control" disabled={disabled} />}
          {predictiveAriaText
            ? <span className="visually-hidden" id={uniqueA11yIdForPredictiveText}>
                {predictiveAriaText}
              </span>
            : null}
          {caption
            ? <span id={uniqueCaptionId} className="input-text wide-message">
                {caption}
              </span>
            : null}
          <div
            aria-live={liveErrors ? 'polite' : null}
            aria-atomic={liveErrors ? 'true' : null}
            role={liveErrors ? 'log' : null}
            aria-relevant={liveErrors ? 'additions' : null}>
            {showValidation
              ? <ValidationError errorText={errorText} isWide={wideError} uniqueA11yId={uniqueA11yId} />
              : ''}
          </div>
        </div>
      </div>
    );
  }
}

ValidatedInput.propTypes = {
  elementValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangeHandler: PropTypes.func,
  labelText: PropTypes.string.isRequired,
  errorText: PropTypes.string,
  labelClass: PropTypes.string,
  inputClass: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.string,
  readOnly: PropTypes.string,
  validators: PropTypes.array,
  wideError: PropTypes.bool,
  disabled: PropTypes.string,
  name: PropTypes.string.isRequired,
  maxLength: PropTypes.string,
  placeholder: PropTypes.string,
  displayValidation: PropTypes.bool,
  isTextArea: PropTypes.bool,
  rows: PropTypes.string,
  a11yLabel: PropTypes.string,
  caption: PropTypes.string,
  predictiveAriaText: PropTypes.string,
  isHidden: PropTypes.bool,
  showInputTextWhenDisabled: PropTypes.bool,
  seleniumName: PropTypes.string,
  liveErrors: PropTypes.bool
};

export default ValidationHOC(ValidatedInput);
