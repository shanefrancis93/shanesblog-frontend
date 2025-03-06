// Type definitions for mermaid
declare namespace mermaid {
    function initialize(config: MermaidConfig): void;
    function init(config?: MermaidConfig, nodes?: Element | NodeListOf<Element>): void;
    function parse(text: string): void;
    function render(id: string, text: string, callback?: (svgCode: string, bindFunctions: Function) => void): void;
}

interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
    fontFamily?: string;
    flowchart?: {
        useMaxWidth?: boolean;
        htmlLabels?: boolean;
        curve?: string;
    };
    onload?: () => void;
    // Add other config options as needed
}

declare global {
    const mermaid: typeof mermaid;
    
    interface Window {
        callback: (nodeId: string) => void;
    }
}
