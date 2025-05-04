import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Button, AppBar, Toolbar, Typography, useMediaQuery, useTheme, IconButton, Drawer } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PreviewIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import { toggleMode } from '../../store/formBuilderSlice'
import LeftSidebar from '../navigation/LeftSidebar'
import Bank from '../bank/Bank'
import FormBuilder from '../formBuilder/FormBuilder'
import FormPreview from '../formPreview/FormPreview'

const Layout = () => {
  const dispatch = useDispatch()
  const { mode } = useSelector(state => state.formBuilder)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  
  const handleToggleMode = () => {
    dispatch(toggleMode())
  }
  
  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen)
  }
  
  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen)
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {isMobile && (
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu"
              onClick={toggleLeftDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleToggleMode}
            startIcon={mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
          >
            {mode === 'edit' ? 'Preview' : 'Edit'}
          </Button>
          {isMobile && mode === 'edit' && (
            <IconButton 
              color="inherit" 
              aria-label="bank"
              onClick={toggleRightDrawer}
              sx={{ ml: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {!isMobile ? (
          <>
            <Box 
              className="sidebar" 
              sx={{ 
                width: 250, 
                flexShrink: 0, 
                backgroundColor: 'background.paper',
                boxShadow: 1,
                overflow: 'auto'
              }}
            >
              <LeftSidebar />
            </Box>
            
            <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
              {mode === 'edit' ? <FormBuilder /> : <FormPreview />}
            </Box>
            
            {mode === 'edit' && (
              <Box 
                className="sidebar"
                sx={{ 
                  width: 300, 
                  flexShrink: 0, 
                  backgroundColor: 'background.paper',
                  boxShadow: 1,
                  overflow: 'auto'
                }}
              >
                <Bank />
              </Box>
            )}
          </>
        ) : (
          <>
            <Drawer
              anchor="left"
              open={leftDrawerOpen}
              onClose={toggleLeftDrawer}
            >
              <Box sx={{ width: 250 }}>
                <LeftSidebar onItemClick={toggleLeftDrawer} />
              </Box>
            </Drawer>
            
            <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
              {mode === 'edit' ? <FormBuilder /> : <FormPreview />}
            </Box>
            
            {mode === 'edit' && (
              <Drawer
                anchor="right"
                open={handleDragEnd}
                onClose={toggleRightDrawer}
              >
                <Box sx={{ width: 280 }}>
                  <Bank onItemClick={toggleRightDrawer} />
                </Box>
              </Drawer>
            )}
          </>
        )}
      </Box>
    </Box>
  )
}

export default Layout