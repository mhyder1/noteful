import React from 'react';
import ReactDOM from 'react-dom';
import ValidationError from '../AddNote/ValidationError';
import { runInNewContext } from 'vm';
import config from '../config';
import NoteError from '../NoteError';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext'

class AddNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          },
          folderId: '',
          content: ''
        }
    } 
    static contextType = ApiContext

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    updateContent(content) {
        this.setState({content: content });
    }

    handleDropdownClick(folderId) { 
        console.log(folderId)
        this.setState({folderId});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {name, content, folderId} = this.state;
    
        console.log('handle submit variables', name, content, folderId);
        let options = {
            method: 'POST', 
            body: JSON.stringify({name: name.value, content , folderId}),
            headers: { 'Content-Type': 'application/json'}
        }
        fetch(`${config.API_ENDPOINT}/notes`, options) 
            .then(res => res.json())
            .then((result) => {
                console.log(result)

            })
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
          return "Name is required";
        } else if (name.length < 3) {
          return "Name must be at least 3 characters long";
        }
    }

    render() { 
        const {folders} = this.props
        const dropdownItems = folders.map(item => { 
            return <option key={item.id} value={item.id}>{item.name}</option>
        })
    

        return (
            <form className="addnote" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Note</h2>
                <div className="addnote__hint">* required field</div>  
                <div className="form-group">
                    <label htmlFor="name">Name *</label>
                    <input type="text" className="name__control"
                        name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                    {this.state.name.touched && <ValidationError message={'There was an error'} />}

                    <label htmlFor="content">Add Text *</label>
                    <input type="text" className="name__control"
                        name="content" id="content" onChange={e => this.updateContent(e.target.value)}/>

                    <label htmlFor="folder">Select Folder *</label>
                    <select onChange={e => this.handleDropdownClick(e.target.value)}>
                        {dropdownItems} 
                    </select>
    
                </div>
    
                <div className="addfolder__button__group">
                <button 
                    type="reset" 
                    className="addnote__button">
                    Cancel
                </button>
                <NoteError>
                    <button 
                        type="submit" 
                        className="addnote__button"
                        disabled={this.validateName()}>
                        Save
                    </button>
                </NoteError>
                </div>
            </form>
        )
    }
}

AddNote.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    //touched: PropTypes.boolean
};

export default AddNote;