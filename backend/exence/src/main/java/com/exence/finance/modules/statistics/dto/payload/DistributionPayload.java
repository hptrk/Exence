package com.exence.finance.modules.statistics.dto.payload;

import com.exence.finance.modules.statistics.dto.WidgetType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(
        title = "Distribution Payload DTO",
        description =
                "Contains a list of DistributionItem objects, each representing a single item in a distribution chart.")
public record DistributionPayload(@Schema(example = "EXPENSE_PIE") WidgetType type, List<DistributionItem> data)
        implements WidgetDataPayload {}
