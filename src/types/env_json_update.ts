interface AmplifyConfiguration {
     aws_project_region: string;
     aws_cloud_logic_custom: CloudLogicCustom[];
}

interface CloudLogicCustom {
     name: string;
     endpoint: string;
     region: string;
}
