﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace IS_Lab5_SOAPCS.ServiceReference1 {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(Namespace="http://soapsoap.com/", ConfigurationName="ServiceReference1.MyFirstSOAPInterface")]
    public interface MyFirstSOAPInterface {
        
        [System.ServiceModel.OperationContractAttribute(Action="http://soapsoap.com/MyFirstSOAPInterface/getHelloWorldAsStringRequest", ReplyAction="http://soapsoap.com/MyFirstSOAPInterface/getHelloWorldAsStringResponse")]
        [System.ServiceModel.DataContractFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc)]
        [return: System.ServiceModel.MessageParameterAttribute(Name="return")]
        string getHelloWorldAsString(string arg0);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://soapsoap.com/MyFirstSOAPInterface/getHelloWorldAsStringRequest", ReplyAction="http://soapsoap.com/MyFirstSOAPInterface/getHelloWorldAsStringResponse")]
        [return: System.ServiceModel.MessageParameterAttribute(Name="return")]
        System.Threading.Tasks.Task<string> getHelloWorldAsStringAsync(string arg0);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://soapsoap.com/MyFirstSOAPInterface/getDaysBetweenDatesRequest", ReplyAction="http://soapsoap.com/MyFirstSOAPInterface/getDaysBetweenDatesResponse")]
        [System.ServiceModel.DataContractFormatAttribute(Style=System.ServiceModel.OperationFormatStyle.Rpc)]
        [return: System.ServiceModel.MessageParameterAttribute(Name="return")]
        long getDaysBetweenDates(string arg0, string arg1);
        
        [System.ServiceModel.OperationContractAttribute(Action="http://soapsoap.com/MyFirstSOAPInterface/getDaysBetweenDatesRequest", ReplyAction="http://soapsoap.com/MyFirstSOAPInterface/getDaysBetweenDatesResponse")]
        [return: System.ServiceModel.MessageParameterAttribute(Name="return")]
        System.Threading.Tasks.Task<long> getDaysBetweenDatesAsync(string arg0, string arg1);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface MyFirstSOAPInterfaceChannel : IS_Lab5_SOAPCS.ServiceReference1.MyFirstSOAPInterface, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class MyFirstSOAPInterfaceClient : System.ServiceModel.ClientBase<IS_Lab5_SOAPCS.ServiceReference1.MyFirstSOAPInterface>, IS_Lab5_SOAPCS.ServiceReference1.MyFirstSOAPInterface {
        
        public MyFirstSOAPInterfaceClient() {
        }
        
        public MyFirstSOAPInterfaceClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public MyFirstSOAPInterfaceClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public MyFirstSOAPInterfaceClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public MyFirstSOAPInterfaceClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public string getHelloWorldAsString(string arg0) {
            return base.Channel.getHelloWorldAsString(arg0);
        }
        
        public System.Threading.Tasks.Task<string> getHelloWorldAsStringAsync(string arg0) {
            return base.Channel.getHelloWorldAsStringAsync(arg0);
        }
        
        public long getDaysBetweenDates(string arg0, string arg1) {
            return base.Channel.getDaysBetweenDates(arg0, arg1);
        }
        
        public System.Threading.Tasks.Task<long> getDaysBetweenDatesAsync(string arg0, string arg1) {
            return base.Channel.getDaysBetweenDatesAsync(arg0, arg1);
        }
    }
}
