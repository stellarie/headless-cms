package com.cms.config;

import com.cms.entity.Component;
import com.cms.entity.HookType;
import com.cms.repository.ComponentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ComponentRepository componentRepository;

    @Override
    public void run(String... args) {
        seed("Hero",
            "Full-width banner with title, subtitle, and a call-to-action button.",
            """
            {
              "title": "string",
              "subtitle": "string",
              "ctaText": "string",
              "ctaUrl": "string",
              "backgroundImage": "string (url, optional)",
              "styles": {
                "backgroundColor": "#6c63ff",
                "textColor": "#ffffff",
                "buttonColor": "#ffffff",
                "buttonTextColor": "#6c63ff"
              }
            }""",
            Map.of(HookType.BEFORE_SAVE, """
                if (!context.data?.title?.trim()) {
                    result.error = "Hero requires a title"
                    return
                }
                result.data = context.data
                """)
        );

        seed("RichTextBlock",
            "A titled section with a rich markdown body.",
            """
            {
              "title": "string",
              "body": "markdown string",
              "styles": {
                "backgroundColor": "#ffffff",
                "textColor": "#1a1a2e",
                "maxWidth": "800px"
              }
            }""",
            Map.of(HookType.BEFORE_SAVE, """
                if (!context.data?.body?.trim()) {
                    result.error = "RichTextBlock requires a body"
                    return
                }
                result.data = context.data
                """)
        );

        seed("Card",
            "A content card with an image, title, description, and optional link.",
            """
            {
              "title": "string",
              "description": "string",
              "imageUrl": "string (url, optional)",
              "linkText": "string (optional)",
              "linkUrl": "string (optional)",
              "styles": {
                "backgroundColor": "#ffffff",
                "textColor": "#1a1a2e",
                "borderRadius": "12px",
                "accentColor": "#6c63ff"
              }
            }""",
            Map.of()
        );

        seed("FAQ",
            "A frequently asked questions section with expandable items.",
            """
            {
              "heading": "string",
              "items": [
                { "question": "string", "answer": "string" }
              ],
              "styles": {
                "backgroundColor": "#f8f9ff",
                "headingColor": "#1a1a2e",
                "questionColor": "#6c63ff",
                "answerColor": "#444444"
              }
            }""",
            Map.of(HookType.BEFORE_SAVE, """
                if (!context.data?.items || context.data.items.isEmpty()) {
                    result.error = "FAQ requires at least one item"
                    return
                }
                result.data = context.data
                """)
        );

        seed("Gallery",
            "A responsive image gallery grid.",
            """
            {
              "title": "string (optional)",
              "images": [
                { "url": "string", "caption": "string (optional)" }
              ],
              "styles": {
                "columns": 3,
                "gap": "12px",
                "borderRadius": "8px",
                "backgroundColor": "#ffffff"
              }
            }""",
            Map.of(HookType.BEFORE_SAVE, """
                if (!context.data?.images || context.data.images.isEmpty()) {
                    result.error = "Gallery requires at least one image"
                    return
                }
                result.data = context.data
                """)
        );

        log.info("Built-in components ready.");
    }

    private void seed(String name, String description, String schema, Map<HookType, String> hooks) {
        if (componentRepository.existsByName(name)) return;

        Component c = new Component();
        c.setName(name);
        c.setDescription(description);
        c.setSchema(schema);
        c.getHooks().putAll(hooks);
        componentRepository.save(c);
        log.info("Seeded built-in component: {}", name);
    }
}
