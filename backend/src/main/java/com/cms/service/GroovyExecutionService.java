package com.cms.service;

import groovy.lang.Binding;
import groovy.lang.GroovyShell;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class GroovyExecutionService {

    /**
     * Executes a Groovy script with the provided context.
     *
     * Scripts have access to:
     *   - context: Map<String, Object> — input data (read-only by convention)
     *   - result:  Map<String, Object> — output data (write here to return values)
     *   - log:     SLF4J logger
     *
     * Example script:
     *   def title = context.data?.title
     *   if (!title) {
     *       result.error = "Title is required"
     *       result.valid = false
     *   } else {
     *       result.valid = true
     *       result.data = context.data
     *   }
     *
     * @param script  Groovy source code
     * @param context input map passed to the script
     * @return the result map populated by the script
     */
    public Map<String, Object> execute(String script, Map<String, Object> context) {
        if (script == null || script.isBlank()) {
            return new HashMap<>();
        }

        Map<String, Object> result = new HashMap<>();

        Binding binding = new Binding();
        binding.setVariable("context", context != null ? context : new HashMap<>());
        binding.setVariable("result", result);
        binding.setVariable("log", log);

        GroovyShell shell = new GroovyShell(binding);

        try {
            shell.evaluate(script);
        } catch (Exception e) {
            log.error("Groovy script execution failed", e);
            result.put("error", e.getMessage());
            result.put("scriptFailed", true);
        }

        return result;
    }

    /**
     * Validates that a script compiles without errors.
     *
     * @param script Groovy source code
     * @return null if valid, error message if invalid
     */
    public String validateScript(String script) {
        if (script == null || script.isBlank()) {
            return null;
        }
        try {
            new GroovyShell().parse(script);
            return null;
        } catch (Exception e) {
            return e.getMessage();
        }
    }
}
