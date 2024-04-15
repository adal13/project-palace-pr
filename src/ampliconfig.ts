const amplifyConfig = {
     aws_project_region: "us-east-1",
     aws_cloud_logic_custom: [
          {
               name: "access_API",
               endpoint: import.meta.env.VITE_ENDPOINT,
               region: "us-east-1"
          }
     ]
};

export default amplifyConfig