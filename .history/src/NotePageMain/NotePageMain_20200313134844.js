import React from 'react'
import Note from '../Note/Note'
import ApiContext from '../ApiContext'
import { findNote } from '../notes-helpers'
import './NotePageMain.css'
export default class NotePageMain extends React.Component {
  static defaultProps = {
    match: {
      params: {}
    }
  }
  static contextType = ApiContext

  /**
   * This delete function should be coming from ApiContext
   */
  // handleDeleteNote = noteId => {
  //   this.setState({
  //       notes: this.state.notes.filter(note => note.id !== noteId)
  //   });
  // };

  // Creating onDelete function to redirect user after delete
  onDeleteNote = () => {
    const note = findNote(this.context.notes, this.props.match.params.noteId)
    this.props.history.push('/') 
  }

  render() {
    const { notes = [] } = this.context

    /**
     * Removed parse int from parseInt(this.props.match.params.noteId)
     * noteId is a string and should not be converted
     */
    const noteId = this.props.match.params.noteId;
    const note = findNote(notes, noteId) || { content: '' }    
    return (
      <section className='NotePageMain'>
        <Note
          id={note.id}
          name={note.name}
          modified={note.modified}
          onDeleteNote={this.onDeleteNote}
        />
        <div className='NotePageMain__content'>
          {note.content.split(/\n \r|\n/).map((para, i) =>
            <p key={i}>{para}</p>
          )}
        </div>
      </section>
    )
  }
}