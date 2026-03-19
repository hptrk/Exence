package com.exence.finance.modules.statistics.mapper;

import com.exence.finance.modules.statistics.dto.WidgetDTO;
import com.exence.finance.modules.statistics.dto.response.ChartWidgetDTO;
import com.exence.finance.modules.statistics.dto.response.StatCardWidgetDTO;
import com.exence.finance.modules.statistics.entity.Widget;
import com.exence.finance.modules.statistics.util.WidgetInfoConstants;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = WidgetInfoConstants.class)
public interface WidgetMapper {

    @Mapping(target = "info", expression = "java(WidgetInfoConstants.getInfo(widget.getType()))")
    StatCardWidgetDTO mapToStatCardDTO(Widget widget);

    @Mapping(target = "info", expression = "java(WidgetInfoConstants.getInfo(widget.getType()))")
    ChartWidgetDTO mapToChartDTO(Widget widget);

    List<StatCardWidgetDTO> mapToStatCardDTOList(List<Widget> widgets);

    List<ChartWidgetDTO> mapToChartDTOList(List<Widget> widgets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Widget mapToWidget(WidgetDTO dto);
}
