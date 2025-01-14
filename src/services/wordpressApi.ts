import axios from 'axios';

export interface WPDocument {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  pdf_url: string;
  acf: {
    pdf_file: string;
  };
}

const getApiConfig = () => {
  const apiUrl = localStorage.getItem('wp_api_url') || 'https://your-wordpress-site.com/wp-json/wp/v2';
  const username = localStorage.getItem('wp_username');
  const password = localStorage.getItem('wp_password');
  
  // Extract base domain from API URL
  const baseDomain = apiUrl.split('/wp-json/wp/v2')[0];

  const config = {
    baseURL: apiUrl,
    headers: {},
  };

  if (username && password) {
    config.headers = {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    };
  }

  return { config, baseDomain };
};

export const wordpressApi = {
  async getDocuments(): Promise<WPDocument[]> {
    try {
      const { config, baseDomain } = getApiConfig();
      const response = await axios.get('/documents', config);
      
      // Transform the response to include the full PDF URL
      return response.data.map((doc: WPDocument) => ({
        ...doc,
        acf: {
          ...doc.acf,
          pdf_file: doc.acf.pdf_file.startsWith('http') 
            ? doc.acf.pdf_file 
            : `${baseDomain}${doc.acf.pdf_file}`
        }
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  },

  async getDocumentById(id: number): Promise<WPDocument | null> {
    try {
      const { config, baseDomain } = getApiConfig();
      const response = await axios.get(`/documents/${id}`, config);
      const doc = response.data;
      
      // Transform the document to include the full PDF URL
      return {
        ...doc,
        acf: {
          ...doc.acf,
          pdf_file: doc.acf.pdf_file.startsWith('http') 
            ? doc.acf.pdf_file 
            : `${baseDomain}${doc.acf.pdf_file}`
        }
      };
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }
};