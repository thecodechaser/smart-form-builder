import { useState } from 'react'
import { useSelector } from 'react-redux'
import { 
  Box, 
  Typography,  
  IconButton
} from '@mui/material'
import { Droppable } from '@hello-pangea/dnd'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import AddOrEditQuestion from './AddOrEditQuestion'
import OptionItem from '../options/OptionItem'

const FollowUpQuestion = ({ question, option }) => {
  const [followUpDialog, setFollowUpDialog] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const { questions } = useSelector(state => state.formBuilder)
  
  const handleEdit = () => {
    setEditMode(true)
    setFollowUpDialog(true)
  }
  
  const handleAddQuestion = () => {
    setFollowUpDialog(true)
  }
  
  const getFollowUpQuestion = () => {
    return questions.find(q => q.id === option.followUpId)
  }
  
  return (

    <>
      {
        !option.followUpId ? (
          <Box>
          <Droppable droppableId={`formBuilder-followUp-${question.id}<=>${option.id}`}>
        {(provided) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ 
              p: 2,
              borderRadius: 1,
              bgcolor: 'rgba(0,0,0,0.03)'
            }}
          >
            <Box 
              className="drag-placeholder"
              onClick={handleAddQuestion}
              sx={{
                height: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 2,
                p: 3
              }}
            >
              <AddIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="body1" color="primary">
                Click here or drag a question from the bank to add
              </Typography>
            </Box>
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
      </Box>
        ) : (
          <Box className="follow-up" sx={{ ml: 4, pl: 2, borderLeft: '2px solid', borderColor: 'primary.light' }}>
          <Typography variant="body2" color="primary.main" sx={{ mb: 1 }}>
            Follow-up Question:
          </Typography>
          
          {(() => {
            const followUpQuestion = getFollowUpQuestion()
            if (!followUpQuestion) return null
            
            return (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
                <Typography variant="body1">
                  {followUpQuestion.text}
                </Typography>
                <Typography variant="caption" sx={{ 
                  backgroundColor: 'rgba(0,0,0,0.07)', 
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1,
                  display: 'inline-block',
                  mt: 1
                }}>
                  {followUpQuestion.type === 'objective' ? 'Single Choice' : 
                   followUpQuestion.type === 'multi-select' ? 'Multiple Choice' : 'Text Answer'}
                </Typography>
                <IconButton size="small" onClick={handleEdit}  color="primary">
                <EditIcon />
              </IconButton>
              </Box>
              </Box>
            )
          })()}

          <OptionItem question={getFollowUpQuestion()} followUpOption={true}/>
        </Box>
        )
      }
      <AddOrEditQuestion 
      editMode={editMode}
      editQuestion={getFollowUpQuestion()}
      parentQuestion={question} 
      option={option} 
      openDialog={followUpDialog} 
      setOpenDialog={setFollowUpDialog} 
      followUpQ={true} />
      </>
  )
}

export default FollowUpQuestion