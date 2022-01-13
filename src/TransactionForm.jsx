import * as React from 'react';
import { TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from "luxon";
import Grid from '@mui/material/Grid';
import CodeEditor from '@uiw/react-textarea-code-editor';


class TransactionForm extends React.Component {
    
    handleEmailChange = (event) => {
        this.setState(currState => {
            return {
                email: event.target.value,
            };
          });
    };

    handleAmountChange = (event) => {
        this.setState(currState => {
            return {
                amount: event.target.value,
            };
          });
    };

    handleCCChange = (event) => {
        this.setState(currState => {
            return {
                creditCardNumber: event.target.value,
            };
          });
    };

    handleNoTxChange = (event) => {
        this.setState(currState => {
            return {
                numberOfTransactions: event.target.value
            };
          });
    };

    sendTransactions(){
        console.log(this.state);
        if (this.state.email == ""){
            this.setState(currState => {
                return {
                    emailError: true,
                };  
            });
        }
        if (this.state.creditCardNumber == ""){
            this.setState(currState => {
            return {
                creditCardError: true
                };
                }
            );
        }
        var inserts = ""
        for (var t = 0; t<this.state.numberOfTransactions; t++){
            /*
            INSERT INTO transactions (
                email_address, card_number, tx_id, timestamp, amount
            ) VALUES (   
                'michael@example.com',
                '358579699410099',
                'f88c5ebb-699c-4a7b-b544-45b30681cc39',
                '2020-04-22T03:19:58',
                50.25
            );
            */
            var timestamp = DateTime.now().plus({seconds: t}).toFormat("yyyy-MM-dd'T'HH:mm:ss");
            var insert = "INSERT INTO transactions (email_address, card_number, tx_id, timestamp, amount) " + 
            "VALUES (" + 
            "'" + this.state.email + "'," +
            "'" + this.state.creditCardNumber + "', " +
            "'" + uuidv4() + "'," + 
            "'" + timestamp + "'," +
            this.state.amount +
            ");"

            inserts += insert;
            //Do this so the code editor gets updated
            this.setState(currState => {
                return {
                    statements: insert + "\n" + this.state.statements
                }
            })

        }
        var body = {
            ksql : inserts,
            streamsProperties: {
                "ksql.streams.auto.offset.reset": "earliest"
              }
        }
        var bodyStr = JSON.stringify(body);

        fetch("http://nico.gravitee.io:8088/ksql", {
            method: "POST",
            mode: "no-cors",
            body: bodyStr,
            headers: {
                "Content-Type" : "application/vnd.ksql.v1+json"
            }
        }).then(res => {
            console.log("Result from ksql");
            console.log(res);
            return res;
        })
        .then(
            (result) => {
                console.log(result)
            },
            (error) => {
                console.log("Error while creating a transaction: ")
                console.log(error)
            } 
        )
        
        
    }

    clearForm(){
        this.setState(currState => {
            var newState = this.defaultState;

            return newState;
        });
    }

    defaultState = {
        email: '',
        creditCardNumber: 0,
        amount: 100,
        numberOfTransactions: 1, //This will be used to specify how many transactions we want to simulate (obviously they will all have the same amount)
        emailError: false,
        creditCardError: false,
        statements: ""
    }

    constructor() {
        super();
        this.state = {
            email: this.defaultState.email,
            creditCardNumber: this.defaultState.creditCardNumber,
            amount: this.defaultState.amount,
            numberOfTransactions: this.defaultState.numberOfTransactions, //This will be used to specify how many transactions we want to simulate (obviously they will all have the same amount)
            emailError: this.defaultState.emailError,
            creditCardError: this.defaultState.creditCardError,
            statements : this.defaultState.statements
        }
    }

    render() {

    return (
      <div style={{ height: 400, width: '100%' }}>
          <div className="container">
              <div className='child'>
                    <div className="field">
                        <TextField
                            error={this.state.emailError || false} 
                            sx={{ m: 1, width: '25ch' }}
                            id="email" 
                            label="Email address" 
                            variant="outlined" 
                            required
                            onChange={this.handleEmailChange}
                            type="email"
                            value={this.state.email}
                            />
                    </div>

                    <div className="field">
                        <TextField
                            sx={{ m: 1, width: '25ch' }} 
                            id="creditCardNumber" 
                            label="Credit Card Number" 
                            variant="outlined" 
                            required
                            onChange={this.handleCCChange}
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            error={this.state.creditCardError || false}
                            value={this.state.creditCardNumber}
                            />
                    </div>
                    <div className="field">
                        <TextField 
                            sx={{ m: 1, width: '25ch' }}
                            id="amount" 
                            label="Amount" 
                            variant="outlined" 
                            required 
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                            onChange={this.handleAmountChange}
                            value={this.state.amount}
                        />
                    </div>
                    <div className="field">
                        <TextField 
                            sx={{ m: 1, width: '25ch' }}
                            id="noTransactions" 
                            label="Number of transaction" 
                            variant="outlined" 
                            helperText="Number of transaction to submit (of given amount)" 
                            required
                            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                            onChange={this.handleNoTxChange}
                            value={this.state.numberOfTransactions}
                            />
                    </div>
                    <Grid
                    container
                    spacing={0}
                    direction="column"
                    justifyContent="center"
                    >
                        <ButtonGroup 
                                disableElevation 
                                size="large" 
                                variant="contained" 
                                aria-label="outlined primary button group">
                                <Grid item xs={12}>
                                    
                                        <Button 
                                        sx={{m: 1}}
                                        endIcon={<SendIcon />}
                                        onClick={() => this.sendTransactions()}
                                        >
                                            Send
                                        </Button>

                                        <Button 
                                        sx={{m: 1}}
                                        startIcon={<DeleteIcon/>}
                                        onClick={() => this.clearForm()}
                                        >
                                            Clear form
                                        </Button>
                                </Grid>   

                        </ButtonGroup>
                    </Grid>                    
                </div>
                <div className='child'>
                <CodeEditor
                    value={this.state.statements}
                    language="sql"
                    placeholder="Please enter SQL code."
                    //onChange={(evn) => setCode(evn.target.value)}
                    padding={15}
                    style={{
                        fontSize: 12,
                        backgroundColor: "#f5f5f5",
                        fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                    }}
    />
                </div>            
            </div>
    </div>
      
    )
  } 
}

export default TransactionForm;