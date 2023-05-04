import { useSelector, useDispatch } from "react-redux"
import { getTicket, reset, closeTicket } from "../features/tickets/ticketSlice"
import { useParams, useNavigate } from "react-router-dom"
import { FaPlus } from "react-icons/fa"
import { getNotes, createNote, reset as notesReset } from "../features/notes/noteSlice"
import { useEffect, useState } from "react"
import BackButton from "../components/BackButton"
import Spinner from "../components/Spinner"
import { toast } from "react-toastify"
import Modal from "react-modal"
import NoteItem from "../components/NoteItem"

const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
}

Modal.setAppElement("#root")

const Ticket = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [noteText, setNoteText] = useState("")

  const { ticket, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.tickets
  )

  const { user } = useSelector((state) => state.auth)
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  )

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { ticketId } = useParams()

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(getTicket(ticketId))
    dispatch(getNotes(ticketId))
  }, [isError, message, ticketId])

  const onTicketClose = () => {
    dispatch(closeTicket(ticketId))
    toast.success("Ticket closed successfully")
    navigate("/tickets")
  }

  // Create Note submit
  const onNoteSubmit = (e) => {
    e.preventDefault()
    dispatch(createNote({ noteText, ticketId }))
    closeModal()
  }

  //  Open/close modal
  const openModal = () => {
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  if (isLoading) return <Spinner />

  if (isError) return <h3>Something went wrong</h3>

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>new</span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-US")}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket--desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {ticket.status !== "closed" && (
        <button onClick={openModal} className="btn">
          <FaPlus />
          Add Note
        </button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add note"
      >
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              value={noteText}
              placeholder="Note text"
              onChange={(e) => setNoteText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      </Modal>

      {notes.map((note) => (
        <NoteItem key={notes._id} note={note} />
      ))}

      {ticket.status !== "closed" && (
        <button onClick={onTicketClose} className="btn btn-block btn-danger">
          Close Ticket
        </button>
      )}
    </div>
  )
}

export default Ticket
