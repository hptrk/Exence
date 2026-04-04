package com.exence.finance.modules.statistics.mapper;

import com.exence.finance.modules.statistics.dto.WidgetCreateDTO;
import com.exence.finance.modules.statistics.dto.response.ChartWidgetDTO;
import com.exence.finance.modules.statistics.dto.response.StatCardWidgetDTO;
import com.exence.finance.modules.statistics.entity.Widget;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WidgetMapper {

    StatCardWidgetDTO mapToStatCardDTO(Widget widget);

    ChartWidgetDTO mapToChartDTO(Widget widget);

    List<StatCardWidgetDTO> mapToStatCardDTOList(List<Widget> widgets);

    List<ChartWidgetDTO> mapToChartDTOList(List<Widget> widgets);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Widget mapToWidget(WidgetCreateDTO dto);
}
