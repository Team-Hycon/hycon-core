declare module "nat-upnp" {
    
    function createClient(): client  
    class client {
    
        public portMapping(paras:parameter, func: (err: any)=> void ): void
    
        public externalIp(func: (err:any, ip: any)=>void):void
    
    }
    type parameter = {
        private: number
        public: number
        ttl: number
        description: string
    }  

}
