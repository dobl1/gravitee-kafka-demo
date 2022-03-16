import * as React from 'react';
import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid';

class AttendeeForm extends React.Component {

    handleFirstnameChange = (event) => {
        this.setState(currState => {
            return {
                firstname: event.target.value,
                firstnameError: event.target.value.trim() == ""
            };
        });
    };

    handleCompanyChange = (event) => {
        this.setState(currState => {
            return {
                company: event.target.value,
                companyError: event.target.value.trim() == ""
            };
        });
    };

    handleLastnameChange = (event) => {
        this.setState(currState => {
            return {
                lastname: event.target.value,
                lastnameError: event.target.value.trim() == ""
            };
        });
    };

    sendAttendees() {
        if (this.state.firstname != "" && this.state.lastname != "" && this.state.company != "") {
            var body = {
                "firstname": this.state.firstname,
                "lastname": this.state.lastname,
                "company": this.state.company
            }
            var bodyStr = JSON.stringify(body);

            fetch("https://dorian-dev-demo-apim-gateway.cloud.gravitee.io/test-kafka/users", {
                method: "POST",
                mode: "no-cors",
                body: bodyStr,
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => {
                return res;
            }).then(
                (result) => {
                    console.log(result)
                },
                (error) => {
                    console.log("Error while creating a attendee: ")
                    console.log(error)
                }
            )
        }
    }

    clearForm() {
        this.setState(currState => {
            var newState = this.defaultState;
            return newState;
        });
    }

    defaultState = {
        firstname: '',
        lastname: '',
        company: '',
        firstnameError: false,
        lastnameError: false,
        companyError: false,
    }

    constructor() {
        super();
        this.state = {
            firstname: this.defaultState.firstname,
            lastname: this.defaultState.lastname,
            company: this.defaultState.company,
            firstnameError: this.defaultState.firstnameError,
            lastnameError: this.defaultState.lastnameError,
            companyError: this.defaultState.companyError,
        }
    }

    render() {

        return (
            <div style={{ height: 400, width: '100%' }}>
                <div className="container">
                    <div className='child2'>
                        <div className="field">
                            <TextField
                                sx={{ m: 1, width: '30ch' }}
                                id="firstname"
                                label="Firstname"
                                required
                                onChange={this.handleFirstnameChange}
                                value={this.state.firstname}
                                error={this.state.firstnameError || false}
                            />
                        </div>
                        <div className="field">
                            <TextField
                                sx={{ m: 1, width: '30ch' }}
                                id="lastname"
                                label="Lastname"
                                variant="outlined"
                                required
                                onChange={this.handleLastnameChange}
                                value={this.state.lastname}
                                error={this.state.lastnameError || false}
                            />
                        </div>
                        <div className="field">
                            <TextField
                                sx={{ m: 1, width: '30ch' }}
                                id="company"
                                label="Company"
                                variant="outlined"
                                required
                                onChange={this.handleCompanyChange}
                                value={this.state.company}
                                error={this.state.companyError || false}
                            />
                        </div>
                        <ButtonGroup disableElevation size="large" variant="contained" aria-label="outlined primary button group">
                            <Grid item xs={12}>
                                <Button sx={{ m: 1 }} endIcon={<SendIcon />} onClick={() => this.sendAttendees()}>Send</Button>
                                <Button sx={{ m: 1 }} startIcon={<DeleteIcon />} onClick={() => this.clearForm()}>Clear form</Button>
                            </Grid>
                        </ButtonGroup>
                    </div>
                </div>
            </div>

        )
    }
}

export default AttendeeForm;