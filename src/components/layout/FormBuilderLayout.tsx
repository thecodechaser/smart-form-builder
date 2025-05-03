import React, { useState } from 'react';
import { Box, Button, AppBar, Toolbar, Typography, Container } from '@mui/material';
import NavigationSidebar from '../navigation/NavigationSidebar';
import FormBuilder from '../formBuilder/FormBuilder';
import BankSidebar from '../bank/BankSidebar';
import FormPreview from '../preview/FormPreview';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { Maximize2, Minimize2, Eye, FileInput, Trash2 } from 'lucide-react';

const FormBuilderLayout: React.FC = () => {
  const { previewMode, togglePreview, clearFormData } = useFormBuilder();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Interactive Form Builder
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Eye size={20} />}
            onClick={togglePreview}
          >
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Trash2 size={20} />}
            onClick={clearFormData}
          >
            Clear
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {/* Left Sidebar */}
        <Box 
          sx={{ 
            width: leftSidebarOpen ? 240 : 40, 
            transition: 'width 0.3s',
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {leftSidebarOpen ? (
            <>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Navigation</Typography>
                <Button 
                  size="small" 
                  onClick={toggleLeftSidebar}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Minimize2 size={18} />
                </Button>
              </Box>
              <NavigationSidebar />
            </>
          ) : (
            <Button 
              fullWidth 
              onClick={toggleLeftSidebar}
              sx={{ 
                minWidth: 'auto', 
                height: '100%', 
                borderRadius: 0,
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Maximize2 size={18} />
              <Typography 
                variant="caption" 
                sx={{ 
                  transform: 'rotate(-90deg)', 
                  whiteSpace: 'nowrap',
                  my: 4,
                }}
              >
                Navigation
              </Typography>
            </Button>
          )}
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          <Container maxWidth="lg" sx={{ py: 3, height: '100%' }}>
            {previewMode ? <FormPreview /> : <FormBuilder />}
          </Container>
        </Box>

        {/* Right Sidebar */}
        <Box 
          sx={{ 
            width: rightSidebarOpen ? 300 : 40, 
            transition: 'width 0.3s',
            bgcolor: 'background.paper',
            borderLeft: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {rightSidebarOpen ? (
            <>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Question & Option Bank</Typography>
                <Button 
                  size="small" 
                  onClick={toggleRightSidebar}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Minimize2 size={18} />
                </Button>
              </Box>
              <BankSidebar />
            </>
          ) : (
            <Button 
              fullWidth 
              onClick={toggleRightSidebar}
              sx={{ 
                minWidth: 'auto', 
                height: '100%', 
                borderRadius: 0,
                p: 0.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Maximize2 size={18} />
              <Typography 
                variant="caption" 
                sx={{ 
                  transform: 'rotate(90deg)', 
                  whiteSpace: 'nowrap',
                  my: 4,
                }}
              >
                Question Bank
              </Typography>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FormBuilderLayout;