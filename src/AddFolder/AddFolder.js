import React from 'react';
import config from '../config';
import PropTypes from 'prop-types';
import ApiContext from '../ApiContext';




class AddFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          name: {
            value: '',
            touched: false
          }
        }
    } 

    static defaultProps = {
        history: {
          push: () => { }
        },
    }

    static contextType = ApiContext
    addFolder = (folder) => {
        this.setState({
            folders: [...this.state.folders, folder]
        })
    }

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {name} = this.state;
    
        console.log(name);
        let options = {
            method: 'POST', 
            body: JSON.stringify({name: name.value }),
            headers: { 'Content-Type': 'application/json'}
        }
        fetch(`${config.API_ENDPOINT}/folder`, options) 
            .then(res => {
                if (!res.ok)
                    return res.json().then(e => Promise.reject(e))
                return res.json()
            })
            .then(folder => {
                this.context.addFolder(folder)
                this.props.history.push(`/folder/${folder.id}`)
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
        
        return (
            <form className="registration" onSubmit={e => this.handleSubmit(e)}>
                <h2>Add Folder</h2>
                {/* <div className="addfolder__hint">* required field</div>   */}
                <div className="form-group">
                <label htmlFor="name">Name</label>{' '}
                <input type="text" className="name__control" required
                    name="name" id="name" onChange={e => this.updateName(e.target.value)}/>
                {this.state.name.touched}
                </div>
    
                <div className="addfolder__button__group">
                <button type="reset" className="addfolder__button">
                    Cancel
                </button>
                <button type="submit" className="addfolder__button" disabled={this.validateName()}>
                    Save
                </button>
                </div>
            </form>
        )
    }
}

AddFolder.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    touched: PropTypes.boolean
};

export default AddFolder;