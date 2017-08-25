import React from 'react';
import PropTypes from 'prop-types';

export const InnerValidationHOC = InnerComponent =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    static contextTypes = {
      initializeFormElement: PropTypes.func.isRequired,
      updateFormElement: PropTypes.func.isRequired,
      setFormElementValidity: PropTypes.func.isRequired,
      getFormElement: PropTypes.func.isRequired,
      getFormElementValidity: PropTypes.func.isRequired,
      getFormElementErrorText: PropTypes.func.isRequired
    };

    componentWillMount() {
      const { name } = this.props;
      const elementValue = this.context.getFormElement(name);

      if (!elementValue) {
        this.context.initializeFormElement(name, '');
      }
      const errorObj = this.runValidation(elementValue);
      this.context.setFormElementValidity(name, errorObj.isValid, errorObj.errorText);
    }

    // componentDidUpdate(prevProps) {
    //   const { name, forceValidateAlways } = this.props;
    //   const elementValue = this.context.getFormElement(name);
    //   if (!forceValidateAlways && prevProps.elementValue === elementValue) {
    //     return;
    //   }
    //   const errorObj = this.runValidation(elementValue);
    //   if (prevProps.errorText !== errorObj.errorText || prevProps.isValid !== errorObj.isValid) {
    //     this.context.setFormElementValidity(name, errorObj.isValid, errorObj.errorText);
    //   }
    // }

    componentWillUnmount() {
      const { name, isValidWhenUnmounted } = this.props;

      if (isValidWhenUnmounted) {
        this.context.setFormElementValidity(name, true, '');
      }
    }

    onChangeHandler(e) {
      const { name, onChange } = this.props;
      this.context.updateFormElement(name, e.target.value);
      const elementValue = this.context.getFormElement(name);
      const errorObj = this.runValidation(elementValue);
      this.context.setFormElementValidity(name, errorObj.isValid, errorObj.errorText);
      if (onChange) {
        onChange(e.target.value);
      }
      this.forceUpdate();
    }

    runValidation(textValue) {
      const validators = this.props.validators ? this.props.validators : [];
      return validators.reduce(
        (prev, cur) => {
          if (prev.errorText || cur.ignore) {
            return prev;
          }
          const validateResult = cur.func(textValue, cur.compare);
          return !validateResult ? { isValid: validateResult, errorText: cur.message } : prev;
        },
        { isValid: true, errorText: '' }
      );
    }

    render() {
      const { name } = this.props;
      const elementValue = this.context.getFormElement(name);
      const errorText = this.context.getFormElementErrorText(name);
      return <InnerComponent elementValue={elementValue} errorText={errorText} {...this.props} onChangeHandler={this.onChangeHandler} />;
    }
  };

InnerValidationHOC.propTypes = {
  name: PropTypes.string.isRequired,
  parentFormName: PropTypes.string.isRequired,
  initializeFormElement: PropTypes.func.isRequired,
  updateFormElement: PropTypes.func.isRequired,
  setFormElementValidity: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  forceValidateAlways: PropTypes.bool,
  isValidWhenUnmounted: PropTypes.bool
};

// export const mapStateToProps = (state, ownProps) => ({
//   elementValue: getFormElement(state, ownProps.parentFormName, ownProps.name),
//   isValid: getFormElementValidity(state, ownProps.parentFormName, ownProps.name),
//   errorText: getFormElementErrorText(state, ownProps.parentFormName, ownProps.name)
// });

const ValidationHOC = InnerComponent => {
  return InnerValidationHOC(InnerComponent);
};

export default ValidationHOC;
