import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';
import { Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, CircularProgress } from '@mui/material';

function App() {
  const [ipRange, setIpRange] = useState('');
  const [scanType, setScanType] = useState('discovery');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/scan-network', {
        ip_range: ipRange,
        scan_type: scanType
      });
      setScanResult(response.data);
    } catch (error) {
      console.error('Error scanning network:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to render table format for ports
  const renderTable = (ports) => {
    return (
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>Port</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>State</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Service</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Product</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Version</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Extra Info</th>
          </tr>
        </thead>
        <tbody>
          {ports.map((port) => (
            <tr key={port.port} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '8px' }}>{port.port}</td>
              <td style={{ padding: '8px' }}>{port.state}</td>
              <td style={{ padding: '8px' }}>{port.name}</td>
              <td style={{ padding: '8px' }}>{port.product}</td>
              <td style={{ padding: '8px' }}>{port.version}</td>
              <td style={{ padding: '8px' }}>{port.extrainfo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const toggleJson = () => {
    setShowJson(!showJson);
  };

  // Function to render formatted JSON
  const renderFormattedJSON = (data) => {
    return (
      <div>
        <h2>Scan Results (Table Format):</h2>
        {data.hosts.map((host) => (
          <div key={host.ip}>
            <h3>Host: {host.ip}</h3>
            <p>State: {host.state}</p>
            {host.protocols.map((protocol) => (
              <div key={protocol.protocol}>
                <h4>Protocol: {protocol.protocol}</h4>
                {renderTable(protocol.ports)}
              </div>
            ))}
          </div>
        ))}
        <button onClick={toggleJson} style={{ marginTop: '10px' }}>
          {showJson ? 'Hide JSON' : 'Show JSON'}
        </button>
        {showJson && (
          <div>
            <h2>Original JSON:</h2>
            <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };


  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Network Scanner
        </Typography>
        <FormControl fullWidth sx={{ my: 2 }}>
          <TextField
            label="Enter IP range (e.g., 192.168.1.0/24)"
            value={ipRange}
            onChange={(e) => setIpRange(e.target.value)}
            variant="outlined"
          />
        </FormControl>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="scan-type-label">Chose Scan Type</InputLabel>
          <Select
            label="Chose Scan Type"
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            variant="outlined"
          >
            <MenuItem value="discovery">Discovery Scan</MenuItem>
            <MenuItem value="common_ports">Most Common Ports</MenuItem>
            <MenuItem value="all_ports">All Ports (TCP and UDP)</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Scan'}
        </Button>
        {scanResult && (
          <Box sx={{ my: 4, textAlign: 'left' }}>
            <Typography variant="h5" gutterBottom>
              Scan Results:
            </Typography>
            <pre>{renderFormattedJSON(scanResult)}</pre>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
