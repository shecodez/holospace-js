import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Image, Header, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../../actions/users';

import logo from './../../assets/images/hs_logo1.png';

// components
import RegisterForm from './../forms/RegisterForm';

class Register extends React.Component {
  submit = data =>
    this.props.register(data).then(() => this.props.history.push('/@me'));

  render() {
    return (
      <div className="register-page">
        <Grid columns={2} centered>
          <Grid.Row stretched>
            <Grid.Column className="logo-col" mobile={16} tablet={4} computer={3}>
              <Segment className="logo-seg">
              <Image src={logo} />
              <Header as="h2" color="violet" textAlign="center">
                HoloSpace
              </Header>
              </Segment>
            </Grid.Column>
            <Grid.Column className="form-col" mobile={16} tablet={8} computer={4}>
              <Segment className="form-seg">
                <Header as="h2" color="violet" textAlign="center">
                  Create an account
                </Header>
                <RegisterForm submit={this.submit} />
                <Header as="h5">
                  {"Already have an account? "}
                  <Link to="/login">Login</Link>
                </Header>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

Register.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  register: PropTypes.func.isRequired
};

export default connect(null, { register })(Register);
