import React from 'react';
import PropTypes from 'prop-types';

export class SubmitForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      validity: {},
      errors: {}
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.initializeFormElement = this.initializeFormElement.bind(this);
    this.updateFormElement = this.updateFormElement.bind(this);
    this.setFormElementValidity = this.setFormElementValidity.bind(this);
    this.getFormElement = this.getFormElement.bind(this);
    this.getFormElementValidity = this.getFormElementValidity.bind(this);
    this.getFormElementErrorText = this.getFormElementErrorText.bind(this);
  }

  static childContextTypes = {
    initializeFormElement: PropTypes.func.isRequired,
    updateFormElement: PropTypes.func.isRequired,
    setFormElementValidity: PropTypes.func.isRequired,
    getFormElement: PropTypes.func.isRequired,
    getFormElementValidity: PropTypes.func.isRequired,
    getFormElementErrorText: PropTypes.func.isRequired
  };

  getChildContext() {
    return {
      initializeFormElement: this.initializeFormElement,
      updateFormElement: this.updateFormElement,
      setFormElementValidity: this.setFormElementValidity,
      getFormElement: this.getFormElement,
      getFormElementValidity: this.getFormElementValidity,
      getFormElementErrorText: this.getFormElementErrorText
    };
  }

  initializeFormElement(name, value) {
    this.setState({
      [name]: value
    });
  }
  updateFormElement(name, value) {
    console.log(name);
    console.log(value);
  }
  setFormElementValidity() {}
  getFormElement() {}
  getFormElementValidity() {}
  getFormElementErrorText() {}

  // componentWillMount() {
  //   const { clearFormSubmit, formName } = this.props;
  //   clearFormSubmit(formName);
  // }

  submitHandler(e) {
    e.preventDefault();
    this.submit(this.state.data);
  }

  submit(e) {
    const { startFormSubmit, formName, onSubmit } = this.props;
    // startFormSubmit(formName);

    onSubmit(e);
  }

  render() {
    const {
      children,
      formName,
      saveText,
      saveIconClass,
      cancelUrl,
      spinnerName,
      hideActions,
      alternateSaveText,
      alternateSaveIconClass,
      alternateButtonName,
      ariaSaveText
    } = this.props;
    // const { uniqueA11yId } = this.state;
    return (
      <form name={formName} className="form-horizontal" onSubmit={this.submitHandler} noValidate="noValidate">
        {children}
        <button className="btn btn-primay" type="submit">Press me</button>
      </form>
    );
  }
}

SubmitForm.propTypes = {
  formName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  saveText: PropTypes.string,
  saveIconClass: PropTypes.string,
  cancelUrl: PropTypes.string,
  customSubmitButton: PropTypes.bool,
  spinnerName: PropTypes.string,
  alternateSaveText: PropTypes.string,
  alternateSaveIconClass: PropTypes.string,
  alternateButtonName: PropTypes.string,
  ariaSaveText: PropTypes.string
};

SubmitForm.displayName = 'SubmitForm';

export default SubmitForm;
